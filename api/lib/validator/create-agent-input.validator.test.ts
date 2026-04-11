import { describe, expect, it } from "bun:test";
import {
  validateCreateAgentInput,
  type CreateAgentInput,
} from "./create-agent-input.validator";

describe("validateCreateAgentInput", () => {
  it("should validate a valid agent input", () => {
    const validInput: CreateAgentInput = {
      alias: "my-agent",
      model: "gpt-4",
      initialPrompt: "You are a helpful assistant",
    };

    const result = validateCreateAgentInput(validInput);

    expect(result).toEqual({ success: true, data: validInput });
  });

  it("should return error when alias is missing", () => {
    const invalidInput = {
      model: "gpt-4",
      initialPrompt: "You are a helpful assistant",
    };

    const result = validateCreateAgentInput(invalidInput);

    expect("success" in result).toBe(false);
    if ("error" in result) {
      expect(result.error.alias).toBeDefined();
    }
  });

  it("should return error when model is missing", () => {
    const invalidInput = {
      alias: "my-agent",
      initialPrompt: "You are a helpful assistant",
    };

    const result = validateCreateAgentInput(invalidInput);

    expect("success" in result).toBe(false);
    if ("error" in result) {
      expect(result.error.model).toBeDefined();
    }
  });

  it("should return error when initialPrompt is missing", () => {
    const invalidInput = {
      alias: "my-agent",
      model: "gpt-4",
    };

    const result = validateCreateAgentInput(invalidInput);

    expect("success" in result).toBe(false);
    if ("error" in result) {
      expect(result.error.initialPrompt).toBeDefined();
    }
  });

  it("should return multiple errors when multiple fields are missing", () => {
    const invalidInput = {
      alias: "my-agent",
    };

    const result = validateCreateAgentInput(invalidInput);

    expect("success" in result).toBe(false);
    if ("error" in result) {
      expect(result.error.model).toBeDefined();
      expect(result.error.initialPrompt).toBeDefined();
    }
  });
});
