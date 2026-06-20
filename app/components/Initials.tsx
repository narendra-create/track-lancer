import React from "react";

interface AvatarInitialsProps {
  initials: string;
  variant?: "gold" | "gold-amber" | "amber-gold";
}

export function AvatarInitials({
  initials,
  variant = "gold",
}: AvatarInitialsProps) {
  const getGradient = () => {
    switch (variant) {
      case "gold-amber":
        return "bg-gradient-to-br from-dash-gold-dim to-dash-amber";
      case "amber-gold":
        return "bg-gradient-to-br from-dash-amber to-dash-gold-dim";
      case "gold":
      default:
        return "bg-gradient-to-br from-dash-gold to-dash-gold-dim";
    }
  };

  return (
    <div
      className={`grid w-[30px] h-[30px] shrink-0 place-items-center rounded-full font-sans text-[0.7rem] font-semibold text-dash-bg ${getGradient()}`}
    >
      {initials.substring(0, 2).toUpperCase()}
    </div>
  );
}
