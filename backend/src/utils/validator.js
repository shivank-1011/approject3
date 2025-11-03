/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  // More comprehensive email regex
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password must not exceed 128 characters",
    };
  }

  // Optional: Check for at least one letter and one number for stronger passwords
  // const hasLetter = /[a-zA-Z]/.test(password);
  // const hasNumber = /[0-9]/.test(password);
  // if (!hasLetter || !hasNumber) {
  //   return { isValid: false, message: "Password must contain both letters and numbers" };
  // }

  return { isValid: true, message: "Password is valid" };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  if (!name || typeof name !== "string") {
    return { isValid: false, message: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, message: "Name must not exceed 50 characters" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true, message: "Name is valid" };
};

/**
 * Validates required fields
 * @param {object} fields - Object with field names as keys and values
 * @returns {array} - Array of error messages
 */
export const validateRequired = (fields) => {
  const errors = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors.push(`${key} is required`);
    }
  });

  return errors;
};

/**
 * Validates amount/monetary value
 * @param {number|string} amount - Amount to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { isValid: false, message: "Amount must be a valid number" };
  }

  if (num <= 0) {
    return { isValid: false, message: "Amount must be greater than 0" };
  }

  if (num > 1000000000) {
    return { isValid: false, message: "Amount exceeds maximum allowed value" };
  }

  // Check for reasonable decimal places (2 decimal places for currency)
  const decimalPlaces = (num.toString().split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    return {
      isValid: false,
      message: "Amount can have at most 2 decimal places",
    };
  }

  return { isValid: true, message: "Amount is valid" };
};

/**
 * Validates registration data
 * @param {object} data - Registration data { name, email, password }
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateRegistration = (data) => {
  const errors = [];
  const { name, email, password } = data;

  // Check required fields
  const requiredErrors = validateRequired({ name, email, password });
  if (requiredErrors.length > 0) {
    return { isValid: false, errors: requiredErrors };
  }

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  // Validate email
  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates login data
 * @param {object} data - Login data { email, password }
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  // Check required fields
  const requiredErrors = validateRequired({ email, password });
  if (requiredErrors.length > 0) {
    return { isValid: false, errors: requiredErrors };
  }

  // Validate email
  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  // Validate password exists (no need for full validation on login)
  if (!password || password.length < 1) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates group name
 * @param {string} name - Group name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateGroupName = (name) => {
  if (!name || typeof name !== "string") {
    return { isValid: false, message: "Group name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName === "") {
    return { isValid: false, message: "Group name cannot be empty" };
  }

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      message: "Group name must be at least 3 characters long",
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      message: "Group name must not exceed 100 characters",
    };
  }

  return { isValid: true, message: "Group name is valid" };
};

/**
 * Validates group creation data
 * @param {object} data - Group data { name }
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateGroupCreation = (data) => {
  const errors = [];
  const { name } = data;

  // Validate group name
  const nameValidation = validateGroupName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates group ID
 * @param {number|string} groupId - Group ID to validate
 * @returns {object} - { isValid: boolean, message: string, value: number }
 */
export const validateGroupId = (groupId) => {
  const id = parseInt(groupId);

  if (isNaN(id)) {
    return { isValid: false, message: "Invalid group ID format", value: null };
  }

  if (id <= 0) {
    return {
      isValid: false,
      message: "Group ID must be a positive number",
      value: null,
    };
  }

  return { isValid: true, message: "Group ID is valid", value: id };
};

/**
 * Validates expense description
 * @param {string} description - Expense description to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateExpenseDescription = (description) => {
  if (!description || typeof description !== "string") {
    return { isValid: false, message: "Expense description is required" };
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription === "") {
    return { isValid: false, message: "Expense description cannot be empty" };
  }

  if (trimmedDescription.length < 3) {
    return {
      isValid: false,
      message: "Expense description must be at least 3 characters long",
    };
  }

  if (trimmedDescription.length > 255) {
    return {
      isValid: false,
      message: "Expense description must not exceed 255 characters",
    };
  }

  return { isValid: true, message: "Expense description is valid" };
};

/**
 * Validates participants array
 * @param {Array} participants - Array of participant user IDs or objects
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateParticipants = (participants) => {
  if (!participants) {
    return { isValid: false, message: "Participants are required" };
  }

  if (!Array.isArray(participants)) {
    return { isValid: false, message: "Participants must be an array" };
  }

  if (participants.length === 0) {
    return {
      isValid: false,
      message: "At least one participant is required",
    };
  }

  if (participants.length > 100) {
    return {
      isValid: false,
      message: "Cannot have more than 100 participants",
    };
  }

  return { isValid: true, message: "Participants are valid" };
};

/**
 * Validates expense creation data with equal splits
 * @param {object} data - Expense data { description, amount, paidBy, groupId, participants }
 * @returns {object} - { isValid: boolean, errors: array }
 */
export const validateExpenseCreation = (data) => {
  const errors = [];
  const { description, amount, paidBy, groupId, participants } = data;

  // Check required fields
  if (!description) errors.push("Description is required");
  if (!amount) errors.push("Amount is required");
  if (!paidBy) errors.push("PaidBy is required");
  if (!groupId) errors.push("GroupId is required");
  if (!participants) errors.push("Participants are required");

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Validate description
  const descValidation = validateExpenseDescription(description);
  if (!descValidation.isValid) {
    errors.push(descValidation.message);
  }

  // Validate amount
  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    errors.push(amountValidation.message);
  }

  // Validate groupId
  const groupIdValidation = validateGroupId(groupId);
  if (!groupIdValidation.isValid) {
    errors.push(groupIdValidation.message);
  }

  // Validate participants
  const participantsValidation = validateParticipants(participants);
  if (!participantsValidation.isValid) {
    errors.push(participantsValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};