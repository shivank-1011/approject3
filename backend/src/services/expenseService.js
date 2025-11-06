import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function calculateSplits(amount, participants) {
  const share = amount / participants.length;
  return participants.map((userId) => ({
    userId: parseInt(userId),
    shareAmount: parseFloat(share.toFixed(2)),
  }));
}

export async function createExpenseWithEqualSplits(expenseData) {
  const { description, amount, paidBy, groupId, participants } = expenseData;

  const splits = calculateSplits(amount, participants);

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

export async function createExpenseWithCustomSplits(expenseData) {
  const { description, amount, paidBy, groupId, participants } = expenseData;

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

export async function calculateBalances(groupId, prisma) {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { splits: true },
  });

  const settlements = await prisma.settlement.findMany({
    where: { groupId },
  });

  const balances = {};

  expenses.forEach((exp) => {
    const payer = exp.paidBy;
    const splits = exp.splits;

    if (!balances[payer]) balances[payer] = 0;

    splits.forEach((s) => {
      if (!balances[s.userId]) balances[s.userId] = 0;

      balances[s.userId] -= s.amount;

      balances[payer] += s.amount;
    });
  });

  settlements.forEach((settlement) => {
    if (!balances[settlement.paidBy]) balances[settlement.paidBy] = 0;
    if (!balances[settlement.paidTo]) balances[settlement.paidTo] = 0;

    balances[settlement.paidBy] += settlement.amount;

    balances[settlement.paidTo] -= settlement.amount;
  });

  return balances;
}

export function simplifyBalances(balances, users) {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, amount]) => {
    if (amount > 0.01) creditors.push({ userId, amount });
    else if (amount < -0.01) debtors.push({ userId, amount: -amount });
  });

  const transactions = [];
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const minAmount = Math.min(creditors[i].amount, debtors[j].amount);

    if (minAmount > 0.01) {
      transactions.push({
        from: parseInt(debtors[j].userId),
        to: parseInt(creditors[i].userId),
        amount: parseFloat(minAmount.toFixed(2)),
      });
    }

    creditors[i].amount -= minAmount;
    debtors[j].amount -= minAmount;

    if (creditors[i].amount < 0.01) i++;
    if (debtors[j].amount < 0.01) j++;
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
