import { NextRequest, NextResponse } from "next/server";
import { ChatMessageType } from "@/types/ChatTypes";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { promptTemplate } from "./PromptTemplate";
import { retrieveDocuments } from "./VectorStore";

const formatMessage = (message: ChatMessageType) => {
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
    console.log("Chat API called");
    const body = await req.json();
    const messages = body.messages ?? [];
    // Get the last 2 messages, not counting the last with the user question, as history
    const history = messages.slice(-3, -1).map(formatMessage);
    const query = messages[messages.length - 1].content;
    console.log("Query:", query);
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: "Missing authentication" },
        { status: 401 }
      );
    }

    const user = await getUser();

    console.log("user auth");
    if (!process.env.OPENAI_API_KEY) {
      console.log("Missing OpenAI API Key");
      throw new Error("Missing OpenAI API Key");
    }

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
//      temperature: 0.0,
    });

    const outputParser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(outputParser);
    console.log("chain created");

    const documents = await retrieveDocuments(query);
    const context = documents
      .map((doc) => `<article>\n\n${doc.pageContent}\n\n</article>`)
      .join("\n");

    console.log("Got context");

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
          },
        }
      );
    });
    console.log("Got stream for runId ", chainRunId);
    return new NextResponse(stream, {
      headers: {
        "x-langsmith-run-id": chainRunId,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}
