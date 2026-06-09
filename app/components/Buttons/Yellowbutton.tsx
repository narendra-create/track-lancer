export type Buttonprop = {
  children: string;
};

export function YellowButton({ children }: Buttonprop) {
  return (
    <button className="rounded-md transition-all ease-in-out duration-150 w-full lg:w-36 text-[10px] text-accent lg:px-4 py-2.5 border hover:bg-accent hover:text-black focus:bg-accent focus:text-black font-mono border-accent">{children}</button>
  );
}
