export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

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


  return { isValid: true, message: "Password is valid" };
};

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

  if (isNaN(num)) {
    return { isValid: false, message: "Amount must be a valid number" };
  }

  if (num <= 0) {
    return { isValid: false, message: "Amount must be greater than 0" };
  }

  if (num > 1000000000) {
    return { isValid: false, message: "Amount exceeds maximum allowed value" };
  }

  const decimalPlaces = (num.toString().split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    return {
      isValid: false,
      message: "Amount can have at most 2 decimal places",
    };
  }

  return { isValid: true, message: "Amount is valid" };
};

export const validateRegistration = (data) => {
  const errors = [];
  const { name, email, password } = data;

  const requiredErrors = validateRequired({ name, email, password });
  if (requiredErrors.length > 0) {
    return { isValid: false, errors: requiredErrors };
  }

  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  const requiredErrors = validateRequired({ email, password });
  if (requiredErrors.length > 0) {
    return { isValid: false, errors: requiredErrors };
  }

  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  if (!password || password.length < 1) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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

export const validateGroupCreation = (data) => {
  const errors = [];
  const { name } = data;

  const nameValidation = validateGroupName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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

export const validateExpenseCreation = (data) => {
  const errors = [];
  const { description, amount, paidBy, groupId, participants } = data;

  if (!description) errors.push("Description is required");
  if (!amount) errors.push("Amount is required");
  if (!paidBy) errors.push("PaidBy is required");
  if (!groupId) errors.push("GroupId is required");
  if (!participants) errors.push("Participants are required");

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const descValidation = validateExpenseDescription(description);
  if (!descValidation.isValid) {
    errors.push(descValidation.message);
  }

  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    errors.push(amountValidation.message);
  }

  const groupIdValidation = validateGroupId(groupId);
  if (!groupIdValidation.isValid) {
    errors.push(groupIdValidation.message);
  }

  const participantsValidation = validateParticipants(participants);
  if (!participantsValidation.isValid) {
    errors.push(participantsValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};