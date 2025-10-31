export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (fields) => {
  const errors = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors.push(`${key} is required`);
    }
  });

  return errors;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};
