import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/types/ChatTypes";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { promptTemplate } from "./PromptTemplate";
import { retrieveDocuments } from "./VectorStore";

const formatMessage = (message: ChatMessage) => {
  let prefix;
  if (message.role === "user") {
    prefix = "Human:";
  } else {
    prefix = "Assistant:";
  }
  return `${prefix} ${message.content}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const history = messages.slice(0, -1).map(formatMessage);
    const query = messages[messages.length - 1].content;
    const {isAuthenticated, getUser} = getKindeServerSession();
    
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Missing authentication' }, { status: 401 });
    }

      const user = await getUser();

      if (!process.env.OPENAI_API_KEY) {
      console.log("Missing OpenAI API Key");
      throw new Error("Missing OpenAI API Key");
    }

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.0,
    });

    const outputParser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(outputParser);

    const documents = await retrieveDocuments(query);
    const context = documents
      .map((doc) => `<article>\n\n${doc.pageContent}\n\n</article>`)
      .join("\n");

    /**
     * Wait for a run id to be generated.
     */
    let chainRunId: string = "";
    const stream: ReadableStream = await new Promise((resolve) => {
      const chainStream = chain.stream(
        { query, history, context },
        {
          callbacks: [
            {
              handleChainStart(_llm, _prompts, runId) {
                if (!chainRunId) {
                    chainRunId = runId;
                }
                resolve(chainStream);
              },
            },
          ],
          metadata: {
            user: user.email,
          }
        }
      );
    });

    return new NextResponse(stream, {
      headers: {
        "x-langsmith-run-id": chainRunId,
      },
    });
  } catch (e) {
    return NextResponse.json({ e }, { status: 500 });
  }
}
