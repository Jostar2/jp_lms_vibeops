import { NextResponse } from "next/server";
import runtimePayload from "../../../data/runtime.json";
import { buildLearningSession } from "../../../features/learning-session/session-model";
import type { RuntimePayload } from "../../../features/learning-session/types";

export function GET() {
  return NextResponse.json(buildLearningSession(runtimePayload as RuntimePayload));
}
