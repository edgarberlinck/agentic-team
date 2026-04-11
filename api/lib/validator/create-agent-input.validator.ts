import type { ValidatorResult } from "../shared/types/validator";

export type CreateAgentInput = {
  alias: string;
  model: string;
  initialPrompt: string;
};

export function validateCreateAgentInput(
  data: unknown,
): ValidatorResult<CreateAgentInput> {
  let result: ValidatorResult<CreateAgentInput> | null = null;

  if (!hasProp(data, "alias")) {
    result = { error: { alias: "Alias is required" } };
  }

  if (!hasProp(data, "model")) {
    result = { error: { ...result?.error, model: "Model is required" } };
  }

  if (!hasProp(data, "initialPrompt")) {
    result = {
      error: { ...result?.error, initialPrompt: "Initial prompt is required" },
    };
  }

  if (!result) {
    result = { success: true, data: data as CreateAgentInput };
  }

  return result;
}

function hasProp(data: any, prop: string): boolean {
  return Object.keys(data).some((key) => key === prop);
}
