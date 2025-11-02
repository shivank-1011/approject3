/**
 * Notification Service
 * Handles sending notifications (console logs for now, can be extended to email/push notifications)
 */

/**
 * Notify when a new member joins a group
 * @param {object} params - { groupName, userName, userEmail }
 */
export const notifyNewMemberJoined = ({ groupName, userName, userEmail }) => {
  console.log("📢 NOTIFICATION: New Member Joined Group");
  console.log(`  Group: ${groupName}`);
  console.log(`  New Member: ${userName} (${userEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

/**
 * Notify when a group is created
 * @param {object} params - { groupName, creatorName, creatorEmail }
 */
export const notifyGroupCreated = ({ groupName, creatorName, creatorEmail }) => {
  console.log("📢 NOTIFICATION: Group Created");
  console.log(`  Group: ${groupName}`);
  console.log(`  Creator: ${creatorName} (${creatorEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

/**
 * Notify when a member leaves a group
 * @param {object} params - { groupName, userName, userEmail }
 */
export const notifyMemberLeft = ({ groupName, userName, userEmail }) => {
  console.log("📢 NOTIFICATION: Member Left Group");
  console.log(`  Group: ${groupName}`);
  console.log(`  Member: ${userName} (${userEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

/**
 * Send a general notification
 * @param {string} message - Notification message
 */
export const sendNotification = (message) => {
  console.log(`📢 NOTIFICATION: ${message}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};