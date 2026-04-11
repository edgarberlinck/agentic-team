export type Agent = {
  id: string;
  alias: string;
  model: string;
  initialPrompt: string;
};

export type NewAgent = Omit<Agent, "id">;
