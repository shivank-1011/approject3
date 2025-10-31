// Calculate equal splits for expenses
export const calculateSplits = (
  totalAmount,
  participantIds,
  splitType = "EQUAL"
) => {
  const splits = [];

  if (splitType === "EQUAL") {
    const amountPerPerson = totalAmount / participantIds.length;

    participantIds.forEach((userId) => {
      splits.push({
        userId,
        amount: parseFloat(amountPerPerson.toFixed(2)),
      });
    });
  }

  // Add other split types (percentage, shares, etc.) as needed

  return splits;
};

// Validate expense data
export const validateExpenseData = (data) => {
  const { description, amount, groupId, participantIds } = data;

  if (!description || description.trim() === "") {
    throw new Error("Description is required");
  }

  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!groupId) {
    throw new Error("Group ID is required");
  }

  if (!participantIds || participantIds.length === 0) {
    throw new Error("At least one participant is required");
  }

  return true;
};
