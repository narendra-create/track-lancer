export function Ticker() {
  const items = [
    "MILESTONE TRACKING",
    "UPI PAYMENT FLOW",
    "CLIENT DASHBOARDS",
    "8-DIGIT PROJECT CODES",
    "DELAY FLAGGING",
    "STOP & SETTLE",
    "FREELANCER",
    "TRANSACTION VERIFICATION",
  ];

  return (
    <div
      className="
      overflow-hidden
      border-y
      border-border
      bg-brand-surface
      py-3
    "
    >
      <div
        className="
          flex
          w-max
          whitespace-nowrap
          animate-ticker
        "
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="
              font-mono
              text-xs
              tracking-label
              text-ink-muted
              uppercase
              px-7
            "
          >
            <span className="text-accent mr-7">·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
