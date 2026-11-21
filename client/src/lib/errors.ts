import { isAxiosError } from "axios";
type ApiErrorBody = {
  message?: string;
  errors?: { field: string; message: string }[];
};
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.errors?.length) {
      return data.errors.map((item) => item.message).join(". ");
    }
    if (data?.message) {
      return data.message;
    }
  }
  return fallback;
}
