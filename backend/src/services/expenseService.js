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
  const totalShares = expense.splits.reduce((sum, split) => sum + split.amount, 0);
  console.log(`[DEBUG] Expense created with ID: ${expense.id}`);
  console.log(`[DEBUG] Total expense amount: ${expense.amount}`);
  console.log(`[DEBUG] Number of splits: ${expense.splits.length}`);
  console.log(`[DEBUG] Total shares: ${totalShares.toFixed(2)}`);
  console.log(`[DEBUG] Splits:`, expense.splits.map(s => ({ userId: s.userId, amount: s.amount })));

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
  const totalShares = expense.splits.reduce((sum, split) => sum + split.amount, 0);
  console.log(`[DEBUG] Expense created with ID: ${expense.id}`);
  console.log(`[DEBUG] Total expense amount: ${expense.amount}`);
  console.log(`[DEBUG] Number of splits: ${expense.splits.length}`);
  console.log(`[DEBUG] Total shares: ${totalShares.toFixed(2)}`);

  return expense;
}

export default {
  calculateSplits,
  createExpenseWithEqualSplits,
  createExpenseWithCustomSplits,
};