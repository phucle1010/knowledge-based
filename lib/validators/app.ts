import { API_KEY_MAX_LENGTH, API_KEY_MIN_LENGTH, API_KEY_REGEX, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@/lib/constants/app";

export type ValidateAppCreateInput = {
    name?: string;
    apiKey?: string;
};

export type ValidateAppCreateSuccess = {
    success: true;
    data: { name: string; apiKey: string };
};

export type ValidateAppCreateFailure = {
    success: false;
    error: string;
};

export type ValidateAppCreateResult = ValidateAppCreateSuccess | ValidateAppCreateFailure;

export function validateAppCreate(body: ValidateAppCreateInput): ValidateAppCreateResult {
    const trimmedName = typeof body.name === "string" ? body.name.trim() : "";
    if (!trimmedName) {
        return { success: false, error: "name is required and must be a non-empty string" };
    }
    if (trimmedName.length < NAME_MIN_LENGTH || trimmedName.length > NAME_MAX_LENGTH) {
        return {
            success: false,
            error: `name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
        };
    }

    const trimmedApiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    if (!trimmedApiKey) {
        return { success: false, error: "apiKey is required and must be a non-empty string" };
    }
    if (trimmedApiKey.length < API_KEY_MIN_LENGTH || trimmedApiKey.length > API_KEY_MAX_LENGTH) {
        return {
            success: false,
            error: `apiKey must be between ${API_KEY_MIN_LENGTH} and ${API_KEY_MAX_LENGTH} characters`,
        };
    }
    if (!API_KEY_REGEX.test(trimmedApiKey)) {
        return {
            success: false,
            error: "apiKey must contain only letters, numbers, hyphens and underscores",
        };
    }

    return {
        success: true,
        data: { name: trimmedName, apiKey: trimmedApiKey },
    };
}
