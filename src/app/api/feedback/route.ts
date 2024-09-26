import { NextRequest, NextResponse } from "next/server";

import { Client } from "langsmith";

const langsmithClient = new Client();

/**
 * This handler creates feedback for a LangSmith trace.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const runId = body.runId;
    const tag = body.tag || "userfeedback";
    const feedback = body.feedback;

    if (!runId || !feedback) {
      return NextResponse.json(
        { error: "You must provide a run id and a value or a score." },
        { status: 400 }
      );
    }
    const feedbackResponse = await langsmithClient.createFeedback(runId, tag, {...feedback})
        
    return NextResponse.json({ feedbackResponse }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * This handler updates feedback for a LangSmith trace.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const feedbackId = body.id;
    const score = body.score;
    if (!feedbackId) {
      return NextResponse.json(
        { error: "You must provide a feedback id" },
        { status: 400 }
      );
    }
    let correction;
    let comment;
    if (score === 1) {
      comment = body.comment;
    } else {
      correction = { desired: body.comment };
    }
    await langsmithClient.updateFeedback(feedbackId, {
      score,
      comment,
      correction,
    });
    return NextResponse.json({}, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}