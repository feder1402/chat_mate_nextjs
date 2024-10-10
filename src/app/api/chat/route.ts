import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { ChatMessageType } from "@/types/ChatTypes";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { promptTemplate } from "./PromptTemplate";
import { retrieveDocuments } from "./VectorStore";
import GetSystemMessage from './SystemMessage'
import model from './ModelOpenAI'

export async function POST(req: NextRequest) {
  try {
    const { history, query, metadata } = await extractChatInfo(req)

    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: "Missing authentication" },
        { status: 401 }
      );  
    }

    const outputParser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(outputParser);

    const documents = await retrieveDocuments(query);
    const context = documents
      .map((doc) => `
      <article>
        <source>
          ${doc?.metadata?.source}
        </source>
        <content>
          ${doc.pageContent}
        </content>
      </article>
      `)
      .join("\n");

    const chainRunId = uuidv4();

    const systemMessage = await GetSystemMessage(user.given_name ?? "unknown");

    const chainStream = await chain.stream(
      { query, history: JSON.stringify([systemMessage, ...history]), context },
      {
        runId: chainRunId,
        metadata: {
          user: user.email,
          ...metadata,
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

const extractChatInfo = async (req: NextRequest) => {
  const body = await req.json();
  const messages = body.messages ?? [];

  // Get the last 2 messages, not counting the last with the user question, as history
  const history = messages.slice(-3, -1).map(formatMessageRole);
  const query = messages[messages.length - 1].content;
  const metadata = body.metadata ?? {};

  return { history, query, metadata }
}

const formatMessageRole = (message: ChatMessageType) => {
  let prefix;
  if (message.role === "user") {
    prefix = "user:";
  } else {
    prefix = "assistant:";
  }
  return `${prefix} ${message.content}`;
};

const getAuthUser = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return null;
  }

  return getUser();
}