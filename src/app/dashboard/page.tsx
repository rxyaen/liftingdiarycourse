"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Placeholder data for the UI only; real data fetching will be added later.
const workouts = [
  {
    id: 1,
    name: "Push Day",
    exercises: [
      {
        id: 1,
        name: "Bench Press",
        sets: [
          { id: 1, reps: 8, weight: 80 },
          { id: 2, reps: 8, weight: 80 },
          { id: 3, reps: 6, weight: 85 },
        ],
      },
      {
        id: 2,
        name: "Overhead Press",
        sets: [
          { id: 4, reps: 10, weight: 40 },
          { id: 5, reps: 8, weight: 45 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Evening Core",
    exercises: [
      {
        id: 3,
        name: "Plank",
        sets: [
          { id: 6, reps: 1, weight: null },
          { id: 7, reps: 1, weight: null },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <h2 className="text-lg font-medium">
        Workouts for {format(date, "do MMM yyyy")}
      </h2>

      {workouts.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged for this date.</p>
      ) : (
        workouts.map((w) => (
          <Card key={w.id}>
            <CardHeader>
              <CardTitle>{w.name}</CardTitle>
              <CardDescription>
                {w.exercises.length} exercise{w.exercises.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {w.exercises.map((e) => (
                <div key={e.id}>
                  <h3 className="text-sm font-medium">{e.name}</h3>
                  <ul className="mt-1 text-sm text-muted-foreground">
                    {e.sets.map((s, i) => (
                      <li key={s.id}>
                        Set {i + 1}: {s.reps} reps
                        {s.weight !== null ? ` × ${s.weight} kg` : " (bodyweight)"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}
