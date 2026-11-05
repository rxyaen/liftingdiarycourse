import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function resolveDate(param: string | string[] | undefined) {
  if (typeof param === "string" && DATE_RE.test(param)) {
    const d = new Date(`${param}T00:00:00.000Z`);
    if (!Number.isNaN(d.getTime()) && d.toISOString().startsWith(param)) {
      return param;
    }
  }
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const date = resolveDate((await props.searchParams).date);
  const workouts = await getWorkoutsForDate(userId, date);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <DatePicker date={date} />
      </div>

      {workouts.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged for this date.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((w) => (
            <li key={w.id} className="rounded-lg border p-4">
              <h2 className="font-medium">{w.name ?? "Workout"}</h2>
              <div className="mt-3 space-y-3">
                {w.workoutExercises.map((we) => (
                  <div key={we.id}>
                    <h3 className="text-sm font-medium">{we.exercise.name}</h3>
                    <ul className="mt-1 text-sm text-muted-foreground">
                      {we.sets.map((s) => (
                        <li key={s.id}>
                          Set {s.setNumber}: {s.reps} reps
                          {s.weight !== null ? ` × ${Number(s.weight)} kg` : " (bodyweight)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
