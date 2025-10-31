// Calculate balances for all users in a group
export const calculateBalances = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    const { paidById, amount, splits } = expense;

    // Initialize balance for payer
    if (!balances[paidById]) {
      balances[paidById] = 0;
    }

    // Payer gets credited
    balances[paidById] += amount;

    // Each participant gets debited their share
    splits.forEach((split) => {
      if (!balances[split.userId]) {
        balances[split.userId] = 0;
      }
      balances[split.userId] -= split.amount;
    });
  });

  return balances;
};

// Simplify debts using greedy algorithm
export const simplifyDebts = (balances) => {
  const settlements = [];

  // Separate creditors and debtors
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  });

  // Sort for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: parseFloat(settleAmount.toFixed(2)),
    });

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

// Calculate minimum transactions needed to settle all debts
export const minimizeTransactions = (balances) => {
  // This is a more complex algorithm for future implementation
  // using the simplified debts approach for now
  return simplifyDebts(balances);
};
