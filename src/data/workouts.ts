import { db } from "@/db";

// `date` is a "YYYY-MM-DD" string; the day is interpreted in UTC.
export async function getWorkoutsForDate(userId: string, date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return db.query.workouts.findMany({
    where: { userId, startedAt: { gte: start, lt: end } },
    orderBy: { startedAt: "asc" },
    with: {
      workoutExercises: {
        orderBy: { order: "asc" },
        with: {
          exercise: true,
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });
}
