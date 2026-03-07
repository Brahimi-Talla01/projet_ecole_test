export interface ApiResponse<T = any> {
      success: boolean;
      data: T;
      message?: string;
      timestamp?: string;
}

export interface ApiError {
      success: false;
      message: string;
      errors?: Record<string, string[]>; 
      statusCode?: number;
      timestamp?: string;
}

export interface PaginatedResponse<T> {
      data: T[];
      meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
      };
}

export interface AuthTokens {
      accessToken: string;
      refreshToken?: string;
      expiresIn: number; 
      tokenType: 'Bearer';
}