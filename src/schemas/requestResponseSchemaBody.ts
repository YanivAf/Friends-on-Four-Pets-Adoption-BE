export const requestSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["Adopt", "Foster"] },
  },
  required: ["type"],
  additionalProperties: false,
};

export const responseSchema = {
  type: "object",
  properties: {
    response: { type: "string", enum: ["Accept", "Decline"] },
    requestId: { type: "string", pattern: "^[a-f0-9]{24}$" },
  },
  required: ["response", "requestId"],
  additionalProperties: false,
};
