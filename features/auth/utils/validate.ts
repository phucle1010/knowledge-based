export class ValidationUtils {
    static validateEmail(email: string): { isValid: boolean; error?: string } {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return { isValid: false, error: "Email is required" };
        }
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Please enter a valid email address" };
        }
        return { isValid: true };
    }

    static validatePassword(password: string): { isValid: boolean; error?: string } {
        if (!password) {
            return { isValid: false, error: "Password is required" };
        }
        if (password.length < 8) {
            return { isValid: false, error: "Password must be at least 8 characters" };
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return {
                isValid: false,
                error: "Password must contain uppercase, lowercase, and number",
            };
        }
        return { isValid: true };
    }

    static validateName(name: string): { isValid: boolean; error?: string } {
        if (!name) {
            return { isValid: false, error: "Name is required" };
        }
        if (name.length < 2) {
            return { isValid: false, error: "Name must be at least 2 characters" };
        }
        if (name.length > 50) {
            return { isValid: false, error: "Name must be less than 50 characters" };
        }
        return { isValid: true };
    }
}
