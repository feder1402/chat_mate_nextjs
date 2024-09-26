"use server";

import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { retrieveDocuments } from "./VectorStore";
import { getPrompt } from "./PromptTemplate";
import { ChatStateType } from "@/types/ChatTypes";

if (!process.env.OPENAI_API_KEY) {
  console.log("Missing OpenAI API Key");
  throw new Error("Missing OpenAI API Key");
}

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

const memory = new BufferMemory()
const chain = new ConversationChain({ llm, memory });

export async function chatAction(
  state: ChatStateType,
  message: string
): Promise<ChatStateType> {
  if (!message) {
    return { ...state, error: "Message is required" };
  }

  try {
    console.log("Retrieving documents for message: ", message);
     const documents = await retrieveDocuments(message);
     const context = documents.map((doc) => `<article>\n\n${doc.pageContent}\n\n</article>`).join("\n");

    const prompt = await getPrompt({query: message, context});
    const response = await chain.invoke({ input: prompt });
    state.messages.push({ role: "bot", content: response.response });
    console.log("Returning response for message: ", message);
    return { ...state };
  } catch (error) {
    console.error("An error occurred while processing the request: ", error);
    return {
      ...state,
      error: `An error occurred while processing the request: ${error}`,
    };
  }
}

