import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  devMessage?: string;
  retryAfter?: number;
}

/** Narrow caught values before reading transport-specific error details. */
export function getErrorDetails(error: unknown): {
  message: string;
  response?: { status?: number; data?: ApiErrorBody };
} {
  if (isAxiosError<ApiErrorBody>(error)) return error;
  return { message: error instanceof Error ? error.message : String(error) };
}
