import runtimePayload from "../data/runtime.json";
import { AIFlowShell } from "../features/learning-session/AIFlowShell";
import { buildLearningSession } from "../features/learning-session/session-model";
import type { RuntimePayload } from "../features/learning-session/types";

export default function HomePage() {
  const session = buildLearningSession(runtimePayload as RuntimePayload);
  return <AIFlowShell session={session} />;
}
