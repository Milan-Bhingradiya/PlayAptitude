// /src/utils/response.ts
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any | null;
}

export const createResponse = (success: boolean, message: string, data: any): ApiResponse => {
  return {
    success,
    message,
    data: data // Only return data if success is true
  };
};
