import Cookies from "js-cookie";

export class TokenManager {
    private static readonly ACCESS_TOKEN_COOKIE = "accessToken";
    private static readonly REFRESH_TOKEN_COOKIE = "refreshToken";

    static getAccessToken(): string | null {
        return Cookies.get(this.ACCESS_TOKEN_COOKIE) || null;
    }

    static getRefreshToken(): string | null {
        return Cookies.get(this.REFRESH_TOKEN_COOKIE) || null;
    }

    static setTokens(accessToken: string, refreshToken: string): void {
        // Set cookies with security options
        Cookies.set(this.ACCESS_TOKEN_COOKIE, accessToken, {
            expires: 1 / 24, // 1 hour
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            httpOnly: false, // Can't be httpOnly on client-side, but we set it server-side
        });

        Cookies.set(this.REFRESH_TOKEN_COOKIE, refreshToken, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            httpOnly: false,
        });
    }

    static clearTokens(): void {
        if (typeof window === "undefined") return;
        Cookies.remove(this.ACCESS_TOKEN_COOKIE);
        Cookies.remove(this.REFRESH_TOKEN_COOKIE);
    }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch {
            return true;
        }
    }

    static decodeUserFromToken(token: string): { id: string; email: string; name: string } | null {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
            };
        } catch {
            return null;
        }
    }
}
