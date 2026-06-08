import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="px-4 my-8">
        <div className="hero-tag text-accent-dim font-sans text-md lg:text-lg">PROJECT MILESTONE TRACKING</div>
        <div className="flex flex-col font-serif text-2xl gap-0 justify-center font-bold">
          <h1>Track Work.</h1>
          <h1 className="text-accent">
            <i>Get paid.</i>
          </h1>
          <h1>On record.</h1>
        </div>
        <div>desc</div>
        <div>buttons</div>
      </section>
    </main>
  );
}
