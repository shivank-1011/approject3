export const generateJoinCode = (length = 8) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

export const generateUniqueJoinCode = async (prisma) => {
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = generateJoinCode();

    const existingGroup = await prisma.group.findUnique({
      where: { joinCode: code },
    });

    if (!existingGroup) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    code = generateJoinCode(12);
  }

  return code;
};
