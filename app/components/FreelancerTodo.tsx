"use client";

import { FormEvent, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const input = e.currentTarget.elements.namedItem(
      "task",
    ) as HTMLInputElement;

    const title = input.value.trim();
    if (!title) return;

    saveTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);

    e.currentTarget.reset();
  };

  const completeTask = (id: number) => {
    saveTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  };

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <div className="overflow-hidden rounded-md border lg:h-full border-[#2c2c2c] bg-[#141414]">
      <div className="border-b border-[#2c2c2c] px-5 py-4">
        <h3 className="font-serif text-[#e8e3d8] text-[16px] lg:text-[20px]">Today's Tasks</h3>

        <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-widest text-[#7a7570]">
          {completed} of {tasks.length} done
        </p>
      </div>

      <div className="p-4">
        <form onSubmit={addTask} className="mb-4 flex gap-2">
          <input
            name="task"
            placeholder="Add a task..."
            className="flex-1 rounded border border-[#2c2c2c] bg-[#1a1a1a] px-3 py-2 text-sm lg:text-md text-[#e8e3d8] outline-none focus:border-[#c8a96e]"
          />

          <button className="rounded border border-[#c8a96e50] bg-[#c8a96e20] px-3 text-[#c8a96e]">
            +
          </button>
        </form>

        <div className="max-h-[300px] overflow-y-auto pr-1 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#383838] [&::-webkit-scrollbar-thumb]:bg-[#2c2c2c] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-[10px] border-b border-[#2c2c2c] py-[9px] last:border-b-0"
            >
              <div
                onClick={() => completeTask(task.id)}
                className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] border-[1.5px] transition-all duration-150 ${
                  task.completed
                    ? "border-[#4a9e75] bg-[#4a9e75] text-[#0d0d0d]"
                    : "border-[#383838] bg-transparent"
                }`}
              >
                {task.completed && <span className="text-[10px] leading-none">✓</span>}
              </div>

              <p
                className={`flex-1 text-[13px] items-center lg:text-md ${
                  task.completed
                    ? "text-[#4a4540] line-through"
                    : "text-[#c4bcb1]"
                }`}
              >
                {task.title}
              </p>

              <button onClick={() => deleteTask(task.id)}>
                <Trash2
                  size={15}
                  className="text-[#7a7570] transition hover:text-[#c06060]"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
