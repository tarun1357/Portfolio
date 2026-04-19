import { QuestionsList } from "@/components/dashboard/questions-list";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Chat gaps",
};

export default async function QuestionsDashboardPage() {
  const bundle = await loadDashboardBundle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Unanswered chat questions</h1>
        <p className="mt-1 max-w-xl text-sm text-zinc-500">
          Questions visitors asked when the assistant could not ground an answer in your published
          chat context. Use them to decide what to add to your profile or chat facts.
        </p>
      </div>
      <QuestionsList initial={bundle.unansweredQuestions} />
    </div>
  );
}
