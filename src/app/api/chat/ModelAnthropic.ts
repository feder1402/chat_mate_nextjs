import { ChatAnthropic } from "@langchain/anthropic";

if (!process.env.ANTHROPIC_API_KEY) {
    console.log("Missing Anthopic API Key");
    throw new Error("Missing Anthopic API Key");
  }

  const model = new ChatAnthropic({
    model: "claude-3-haiku-20240307",
    streaming: true,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
  });

  export default model;
