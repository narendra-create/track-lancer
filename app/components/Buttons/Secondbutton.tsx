import type { Buttonprop } from "./Yellowbutton";

export function Secondbutton({ children }: Buttonprop) {
  return (
    <button className="rounded-md transition-all ease-in-out duration-150 w-full lg:w-36 text-[10px] text-ink-muted lg:px-4 py-2.5 border hover:text-ink focus:text-ink font-mono border-ink-muted">
      {children}
    </button>
  );
}
