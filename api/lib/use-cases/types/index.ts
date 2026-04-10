import type { ValidatorResult } from "@/lib/shared/types/validator";

type ErrorOf<T> = Extract<ValidatorResult<T>, { error: unknown }>["error"];

export type UseCaseOutput<T, V> =
  | { success: true; data: T }
  | { success: false; error: ErrorOf<V> };
