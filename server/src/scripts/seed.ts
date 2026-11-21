import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db";
import { Project } from "../models/Project";
import { Run, RunStatus } from "../models/Run";
import { User } from "../models/User";
const RUN_COUNT = 80;
const DAY = 24 * 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const DEMO_EMAIL = "demo@pipelinepulse.dev";
const DEMO_PASSWORD = "Demo12345!";
const workflows = [
  { name: "Build and test", baseMinutes: 6 },
  { name: "Deploy staging", baseMinutes: 3 },
];
const branches = [
  "main",
  "main",
  "main",
  "feat/checkout",
  "fix/auth-bug",
  "feat/search",
];
const actors = ["priya", "arjun", "meera", "sam"];
const messages = [
  "Fix cart total rounding",
  "Add retry to payment call",
  "Update dependencies",
  "Refactor search filters",
  "Improve login error message",
  "Add unit tests for checkout",
];
function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
function randomSha(): string {
  return Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}
async function seed() {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: DEMO_EMAIL },
    {
      name: "Demo User",
      email: DEMO_EMAIL,
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
    },
    { upsert: true, returnDocument: "after" },
  );
  if (!user) {
    throw new Error("Could not create the demo user");
  }
  const project = await Project.findOneAndUpdate(
    { repoFullName: "acme/web-app" },
    { name: "Acme Web App", repoFullName: "acme/web-app", owner: user._id },
    { upsert: true, returnDocument: "after" },
  );
  if (!project) {
    throw new Error("Could not create the demo project");
  }
  await Run.deleteMany({ project: project._id });
  const now = Date.now();
  const step = (14 * DAY) / RUN_COUNT;
  const runs = Array.from({ length: RUN_COUNT }, (_, i) => {
    const isLast = i === RUN_COUNT - 1;
    const workflow = pick(workflows);
    const startedAt = isLast
      ? new Date(now - 90 * 1000)
      : new Date(now - (RUN_COUNT - i) * step);
    const daysAgo = (now - startedAt.getTime()) / DAY;
    const slowFactor = daysAgo > 2 && daysAgo < 5 ? 1.5 : 1;
    const durationMs = Math.round(
      workflow.baseMinutes * MINUTE * slowFactor * (0.8 + Math.random() * 0.4),
    );
    const status: RunStatus = isLast
      ? "in_progress"
      : Math.random() < 0.12
        ? "failure"
        : "success";
    const finished = status !== "in_progress";
    return {
      project: project._id,
      runNumber: 2760 + i,
      workflowName: workflow.name,
      branch: pick(branches),
      commitSha: randomSha(),
      commitMessage: pick(messages),
      actor: pick(actors),
      status,
      startedAt,
      completedAt: finished
        ? new Date(startedAt.getTime() + durationMs)
        : undefined,
      durationMs: finished ? durationMs : undefined,
    };
  });
  await Run.insertMany(runs);
  console.log(`Seeded ${runs.length} runs for ${project.repoFullName}`);
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await disconnectDB();
}
seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
