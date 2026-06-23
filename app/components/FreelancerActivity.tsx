import React from "react";

type ActivityItem = {
  id: number;
  icon: string;
  iconColorClass: string;
  text: React.ReactNode;
  time: string;
};

const activities: ActivityItem[] = [
  {
    id: 1,
    icon: "💸",
    iconColorClass: "bg-[#4a9e75]/[0.1]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">₹20,000 received</strong>{" "}
        from TechMart for Milestone 2
      </>
    ),
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: "✉",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">New message</strong> from
        Priya (FitLife) — API scope change
      </>
    ),
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: "⚑",
    iconColorClass: "bg-[#c87840]/[0.1]",
    text: (
      <>
        Client flagged{" "}
        <strong className="font-medium text-[#c4bcb1]">delay notice</strong> on
        EduTech Portal
      </>
    ),
    time: "Yesterday · 3 PM",
  },
  {
    id: 4,
    icon: "★",
    iconColorClass: "bg-[#4a9e75]/[0.1]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">5-star review</strong>{" "}
        from FitLife Co. — "Excellent work!"
      </>
    ),
    time: "Yesterday · 6 PM",
  },
  {
    id: 5,
    icon: "📋",
    iconColorClass: "bg-[#222222]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Milestone 3</strong>{" "}
        marked done on E-Commerce Platform
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 6,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 7,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 17,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 76,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 57,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 77,
    icon: "🔔",
    iconColorClass: "bg-[#c8a96e]/[0.15]",
    text: (
      <>
        <strong className="font-medium text-[#c4bcb1]">Reminder:</strong>{" "}
        LearnWave deadline in 8 days
      </>
    ),
    time: "2 days ago",
  },
];

export default function FreelancerActivity() {
  return (
    <div>
      <div className="mb-[12px] font-serif text-[.95rem] text-[#e8e3d8]">
        Activity
      </div>
      <div className="overflow-hidden rounded-[6px] border border-[#2c2c2c] bg-[#141414]">
        <div className="px-[16px] py-[18px] max-h-89 lg:max-h-130 overflow-y-auto custom-scrollbar lg:h-full">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex gap-[10px] border-b border-[#2c2c2c] py-[11px] last:border-b-0"
            >
              <div
                className={`mt-[1px] grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[4px] text-[.75rem] ${act.iconColorClass}`}
              >
                {act.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[.78rem] leading-[1.4] text-[#97918b]">
                  {act.text}
                </div>
                <div className="mt-[3px] font-mono text-[7px] tracking-[1px] text-[#cdc3b8]">
                  {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
