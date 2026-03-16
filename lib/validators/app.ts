import { API_KEY_MAX_LENGTH, API_KEY_MIN_LENGTH, API_KEY_REGEX, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@/lib/constants/app";

export type ValidateAppInput = {
    name?: string;
    apiKey?: string;
};

export type ValidateAppSuccess = {
    success: true;
    data: { name?: string; apiKey?: string };
};

export type ValidateAppFailure = {
    success: false;
    error: string;
};

export type ValidateAppResult = ValidateAppSuccess | ValidateAppFailure;

export const validateAppCreate = (body: ValidateAppInput): ValidateAppResult => {
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
};

export const validateAppUpdate = (body: ValidateAppInput): ValidateAppResult => {
    const update: { name?: string; apiKey?: string } = {};

    if (typeof body.name === "string") {
        const trimmedName = body.name.trim();
        if (!trimmedName) {
            return { success: false, error: "name must be a non-empty string when provided" };
        }
        if (trimmedName.length < NAME_MIN_LENGTH || trimmedName.length > NAME_MAX_LENGTH) {
            return {
                success: false,
                error: `name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
            };
        }
        update.name = trimmedName;
    }

    if (typeof body.apiKey === "string") {
        const trimmedApiKey = body.apiKey.trim();
        if (!trimmedApiKey) {
            return { success: false, error: "apiKey must be a non-empty string when provided" };
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
        update.apiKey = trimmedApiKey;
    }

    if (!update.name && !update.apiKey) {
        return {
            success: false,
            error: "At least one of name or apiKey must be provided",
        };
    }

    return { success: true, data: update };
};
