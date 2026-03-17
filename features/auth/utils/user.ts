import Cookies from "js-cookie";

import { TokenManager } from "@/features/auth/utils/token";

export class UserManager {
    static getUser(): { id: string; email: string; name: string } | null {
        const token = TokenManager.getAccessToken();
        if (!token) return null;
        return TokenManager.decodeUserFromToken(token);
    }

    static isAuthenticated(): boolean {
        const token = TokenManager.getAccessToken();
        return token ? !TokenManager.isTokenExpired(token) : false;
    }
}
