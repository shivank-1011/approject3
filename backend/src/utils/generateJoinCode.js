/**
 * Generate a random alphanumeric join code
 * @param {number} length - Length of the join code (default: 8)
 * @returns {string} - Random alphanumeric code
 */
export const generateJoinCode = (length = 8) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

/**
 * Generate a unique join code that doesn't exist in the database
 * @param {object} prisma - Prisma client instance
 * @returns {Promise<string>} - Unique join code
 */
export const generateUniqueJoinCode = async (prisma) => {
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = generateJoinCode();

    // Check if code already exists
    const existingGroup = await prisma.group.findUnique({
      where: { joinCode: code },
    });

    if (!existingGroup) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    // If we couldn't generate a unique code, use a longer one
    code = generateJoinCode(12);
  }

  return code;
};
