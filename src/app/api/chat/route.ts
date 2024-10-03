import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
    const body = await req.json();
    const messages = body.messages ?? [];
    // Get the last 2 messages, not counting the last with the user question, as history
    const history = messages.slice(-3, -1).map(formatMessage);
    const query = messages[messages.length - 1].content;
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: "Missing authentication" },
        { status: 401 }
      );
    }

    const user = await getUser();

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

    const documents = await retrieveDocuments(query);
    const context = documents
      .map((doc) => `<article>\n\n${doc.pageContent}\n\n</article>`)
      .join("\n");

    const chainRunId = uuidv4();

    const chainStream = await chain.stream(
      { query, history, context },
      {
        runId: chainRunId,
        metadata: {
          user: user.email,
        },
      }
    );

    return new NextResponse(chainStream, {
      headers: {
        "x-langsmith-run-id": chainRunId,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}
