import { ChatOpenAI } from "@langchain/openai";

if (!process.env.OPENAI_API_KEY) {
    console.log("Missing OpenAI API Key");
    throw new Error("Missing OpenAI API Key");
  }

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.0,
  });

  export default model;
