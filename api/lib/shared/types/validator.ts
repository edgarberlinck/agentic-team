export type ValidatorResult<T> =
  | {
      success: boolean;
      data: T;
    }
  | {
      error: Record<string, string>;
    };
