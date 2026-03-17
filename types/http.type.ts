export type Pagination = {
    page: number;
    limit: number;
};

export type PaginationResponse = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ListWithPaginationResponse<T> = {
    data: T[];
    meta: PaginationResponse;
};

export interface ErrorResponse {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
}
