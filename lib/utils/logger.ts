export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

class Logger {
    private static instance: Logger;
    private currentLevel: LogLevel = LogLevel.INFO;

    private constructor() {
        if (process.env.NODE_ENV === "development") {
            this.currentLevel = LogLevel.DEBUG;
        } else if (process.env.LOG_LEVEL) {
            const envLevel = process.env.LOG_LEVEL.toUpperCase();
            this.currentLevel = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
        }
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.currentLevel;
    }

    private formatMessage(level: string, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

        if (data) {
            if (typeof data === "object") {
                formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
            } else {
                formattedMessage += ` ${data}`;
            }
        }

        return formattedMessage;
    }

    debug(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(this.formatMessage("debug", message, data));
        }
    }

    info(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(this.formatMessage("info", message, data));
        }
    }

    log(message: string, data?: unknown): void {
        // Alias for info
        this.info(message, data);
    }

    warn(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage("warn", message, data));
        }
    }

    error(message: string, error?: Error | unknown): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            const errorData = error instanceof Error ? { error: error.message, stack: error.stack } : error;
            console.error(this.formatMessage("error", message, errorData));
        }
    }
}

// Export singleton instance
export const logger = Logger.getInstance();
