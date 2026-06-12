export type sidefeaturecard = {
  text: string;
  stat: string;
  isFirst: boolean;
};

type features = {
  feature: sidefeaturecard;
};

export function SideFeaturecard({ feature }: features) {
  return (
    <div
      className={`${feature.isFirst ? "border-y" : "border-b"} mx-4 px-1.5 flex flex-col gap-1.5 lg:px-2 lg:py-4 lg:mx-6 border-ink-muted/60 py-3`}
    >
      <h2 className="text-accent text-2xl font-mono lg:text-3xl">
        {feature.stat}
      </h2>
      <h3 className="text-ink-muted text-[10px] lg:text-[12px] font-sans">
        {feature.text.toUpperCase()}
      </h3>
    </div>
  );
}
