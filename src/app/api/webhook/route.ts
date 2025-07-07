import { db } from "@/db"
import { agents, meetings } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { streamVideo } from "@/lib/stream-video"
import { CallEndedEvent, CallRecordingReadyEvent, CallSessionParticipantLeftEvent, CallSessionStartedEvent, CallTranscriptionReadyEvent } from "@stream-io/node-sdk"
import { and, eq, not } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

type TPayloadType = Record<string, unknown>

export function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature)
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    console.error("Missing signature or API key", { signature, apiKey });
    return NextResponse.json(
      { error: "Missing, signature or API key" },
      { status: 400 }
    )
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    console.error("Invalid signature", { body, signature });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }


  let payload: unknown;
  try {
    payload = JSON.parse(body) as TPayloadType;
  } catch {
    console.error("Invalid JSON payload", { body });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const eventType = (payload as TPayloadType)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      console.error("Missing meetingId in session_started event", { event });
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
    }
    console.log({ meetingId })
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "processing"))

        )
      )
    if (!existingMeeting) {
      console.error("No meeting found with id", { meetingId });
      return NextResponse.json({ error: "No meeting with id found" }, { status: 400 })
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date()
      })
      .where(eq(meetings.id, meetingId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(
        eq(agents.id, existingMeeting.agentId)
      )

    if (!existingAgent) {
      console.error("No agent found with id", { agentId: existingMeeting.agentId });
      return NextResponse.json({ error: "No agent with id found" }, { status: 400 })
    }

    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPEN_AI_API_KEY!,
      agentUserId: existingAgent.id
    });


    realtimeClient.updateSession({
      instruction: existingAgent.instructions
    })
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
    }
    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date()
      })
      .where(
        and(
          eq(meetings.id, meetingId),
          eq(meetings.status, "active")
        )
      )

  } else if (eventType === "call.transcription_ready") {
    console.log({ eventType })
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
    }
    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url
      })
      .where(
        eq(meetings.id, meetingId)
      ).returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Missing meeting found" }, { status: 404 })
    }
    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl
      }
    })
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
    }
    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url
      })
      .where(
        eq(meetings.id, meetingId)
      )

  }


  return NextResponse.json({ statusbar: "ok" })
}