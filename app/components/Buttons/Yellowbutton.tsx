type Buttonprop = {
  children: string;
};

export function YellowButton({ children }: Buttonprop) {
  return <button>{children}</button>;
}
