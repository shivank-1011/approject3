import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Calculate equal splits for expense participants
 * @param {number} amount - Total expense amount
 * @param {Array} participants - Array of participant user IDs
 * @returns {Array} - Array of split objects with userId and shareAmount
 */
export function calculateSplits(amount, participants) {
  const share = amount / participants.length;
  return participants.map((userId) => ({
    userId: parseInt(userId),
    shareAmount: parseFloat(share.toFixed(2)),
  }));
}

/**
 * Create expense with equal splits
 * @param {object} expenseData - Expense data { description, amount, paidBy, groupId, participants }
 * @returns {Promise<object>} - Created expense with splits
 */
export async function createExpenseWithEqualSplits(expenseData) {
  const { description, amount, paidBy, groupId, participants } = expenseData;

  // Calculate equal splits
  const splits = calculateSplits(amount, participants);

  // Create expense with splits in a transaction
  const expense = await prisma.expense.create({
    data: {
      description,
      amount: parseFloat(amount),
      paidBy: parseInt(paidBy),
      groupId: parseInt(groupId),
      splits: {
        create: splits.map((split) => ({
          userId: split.userId,
          amount: split.shareAmount,
        })),
      },
    },
    include: {
      paidByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      splits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Console log for debugging
  const totalShares = expense.splits.reduce(
    (sum, split) => sum + split.amount,
    0
  );
  console.log(`[DEBUG] Expense created with ID: ${expense.id}`);
  console.log(`[DEBUG] Total expense amount: ${expense.amount}`);
  console.log(`[DEBUG] Number of splits: ${expense.splits.length}`);
  console.log(`[DEBUG] Total shares: ${totalShares.toFixed(2)}`);
  console.log(
    `[DEBUG] Splits:`,
    expense.splits.map((s) => ({ userId: s.userId, amount: s.amount }))
  );

  return expense;
}

/**
 * Create expense with custom splits
 * @param {object} expenseData - Expense data { description, amount, paidBy, groupId, participants: [{ userId, amount }] }
 * @returns {Promise<object>} - Created expense with splits
 */
export async function createExpenseWithCustomSplits(expenseData) {
  const { description, amount, paidBy, groupId, participants } = expenseData;

  // Create expense with custom splits in a transaction
  const expense = await prisma.expense.create({
    data: {
      description,
      amount: parseFloat(amount),
      paidBy: parseInt(paidBy),
      groupId: parseInt(groupId),
      splits: {
        create: participants.map((p) => ({
          userId: parseInt(p.userId),
          amount: parseFloat(p.amount),
        })),
      },
    },
    include: {
      paidByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      splits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Console log for debugging
  const totalShares = expense.splits.reduce(
    (sum, split) => sum + split.amount,
    0
  );
  console.log(`[DEBUG] Expense created with ID: ${expense.id}`);
  console.log(`[DEBUG] Total expense amount: ${expense.amount}`);
  console.log(`[DEBUG] Number of splits: ${expense.splits.length}`);
  console.log(`[DEBUG] Total shares: ${totalShares.toFixed(2)}`);

  return expense;
}

/**
 * Calculate net balances for all members in a group
 * @param {number} groupId - Group ID
 * @param {object} prisma - Prisma client instance
 * @returns {Promise<object>} - Object with userId as key and net balance as value
 */
export async function calculateBalances(groupId, prisma) {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { splits: true },
  });

  const balances = {};

  expenses.forEach((exp) => {
    const payer = exp.paidBy;
    const splits = exp.splits;

    // Initialize balances for payer if not exists
    if (!balances[payer]) balances[payer] = 0;

    // Deduct share for each participant
    splits.forEach((s) => {
      if (!balances[s.userId]) balances[s.userId] = 0;

      // Each participant owes their share (negative balance)
      balances[s.userId] -= s.amount;

      // Payer is owed the share amount (positive balance)
      balances[payer] += s.amount;
    });
  });

  return balances;
}

/**
 * Convert raw balances into human-readable "A owes B" pairs
 * @param {object} balances - Object with userId as key and net balance as value
 * @param {Array} users - Optional array of user objects for additional context
 * @returns {Array} - Array of transaction objects { from, to, amount }
 */
export function simplifyBalances(balances, users) {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, amount]) => {
    if (amount > 0) creditors.push({ userId, amount });
    else if (amount < 0) debtors.push({ userId, amount: -amount });
  });

  const transactions = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const minAmount = Math.min(creditors[i].amount, debtors[j].amount);
    transactions.push({
      from: parseInt(debtors[j].userId),
      to: parseInt(creditors[i].userId),
      amount: parseFloat(minAmount.toFixed(2))
    });

    creditors[i].amount -= minAmount;
    debtors[j].amount -= minAmount;

    if (creditors[i].amount === 0) i++;
    if (debtors[j].amount === 0) j++;
  }

  return transactions;
}

export default {
  calculateSplits,
  createExpenseWithEqualSplits,
  createExpenseWithCustomSplits,
  calculateBalances,
  simplifyBalances,
};