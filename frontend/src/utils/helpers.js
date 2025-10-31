// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate split amounts
export const calculateSplit = (total, numberOfPeople) => {
  return (total / numberOfPeople).toFixed(2);
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Calculate balance
export const calculateBalance = (expenses, userId) => {
  let balance = 0;
  expenses.forEach((expense) => {
    if (expense.paidBy === userId) {
      balance += expense.amount;
    }
    if (expense.participants.includes(userId)) {
      balance -= expense.amount / expense.participants.length;
    }
  });
  return balance;
};
