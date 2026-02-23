// register-constants.ts

export const REGISTER_TEXT = {
  BRAND_TITLE: "IMS - Insurance Management System",
  BRAND_SUBTITLE: "Secure your future with our enterprise-grade identity management system. Simple, fast, and encrypted.",
  FORM_TITLE: "Create Account",
  FORM_SUBTITLE: "Get started in less than 2 minutes.",
  LOGIN_PROMPT: "Already a member?",
  LOGIN_LINK: "Log In",
  SUCCESS_REDIRECT: "Account created successfully! Redirecting...",
  ERROR_CONNECTION: "Connection lost. Please check your internet.",
  ERROR_GENERIC: "Registration failed",
};

export const validatePasswords = (pass: string, confirm: string): string | null => {
  if (pass !== confirm) {
    return "Passwords do not match. Please double-check.";
  }
  return null;
};

export const prepareRegisterFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  formData.append("first_name", data.firstName);
  formData.append("last_name", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("password", data.password);
  formData.append("role", "customer");
  
  if (data.age) formData.append("age", data.age);
  if (data.gender) formData.append("gender", data.gender);
  if (data.imageFile) formData.append("image", data.imageFile);
  
  return formData;
};