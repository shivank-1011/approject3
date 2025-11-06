
export const notifyNewMemberJoined = ({ groupName, userName, userEmail }) => {
  console.log("📢 NOTIFICATION: New Member Joined Group");
  console.log(`  Group: ${groupName}`);
  console.log(`  New Member: ${userName} (${userEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

export const notifyGroupCreated = ({ groupName, creatorName, creatorEmail }) => {
  console.log("📢 NOTIFICATION: Group Created");
  console.log(`  Group: ${groupName}`);
  console.log(`  Creator: ${creatorName} (${creatorEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

export const notifyMemberLeft = ({ groupName, userName, userEmail }) => {
  console.log("📢 NOTIFICATION: Member Left Group");
  console.log(`  Group: ${groupName}`);
  console.log(`  Member: ${userName} (${userEmail})`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};

export const sendNotification = (message) => {
  console.log(`📢 NOTIFICATION: ${message}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("---");
};