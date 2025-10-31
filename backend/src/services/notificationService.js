// Placeholder for notification service
// Can be extended to send emails, push notifications, etc.

export const sendExpenseNotification = async (expense, participants) => {
  // TODO: Implement email/push notification logic
  console.log(`Notification: New expense "${expense.description}" added`);
};

export const sendSettlementNotification = async (settlement) => {
  // TODO: Implement notification logic
  console.log(`Notification: Settlement of $${settlement.amount} recorded`);
};

export const sendGroupInviteNotification = async (group, invitedUser) => {
  // TODO: Implement notification logic
  console.log(
    `Notification: ${invitedUser.email} invited to group ${group.name}`
  );
};
