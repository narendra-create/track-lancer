import React from "react";

export default function ClientDashboardSkeleton() {
  return (
    <main className="bg-[var(--color-dash-bg)] min-h-screen p-2 lg:p-4 animate-pulse">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row gap-4 mb-6 lg:justify-between mx-2">
        <div className="mt-5 mx-2.5">
          {/* Hero Tag */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-0.5 w-6 bg-[var(--color-dash-surface3)]" />
            <div className="h-3 w-32 bg-[var(--color-dash-surface3)] rounded" />
          </div>
          {/* Greeting */}
          <div className="flex flex-col gap-2">
            <div className="h-7 w-64 bg-[var(--color-dash-surface2)] rounded" />
            <div className="h-3.5 w-48 bg-[var(--color-dash-surface2)] rounded mt-1" />
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex lg:items-center lg:justify-center gap-3 max-w-68 lg:max-w-none ml-3 mt-4 lg:mt-0">
          <div className="h-11 w-32 bg-[var(--color-dash-surface2)] rounded-md" />
          <div className="h-11 w-36 bg-[var(--color-dash-gold-glow)] border border-[rgba(200,169,110,0.2)] rounded-md" />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mx-2 my-2 lg:my-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-8 w-8 rounded-full bg-[var(--color-dash-surface3)]" />
              <div className="h-4 w-16 bg-[var(--color-dash-surface3)] rounded" />
            </div>
            <div>
              <div className="h-6 w-24 bg-[var(--color-dash-surface2)] rounded mb-2" />
              <div className="h-3 w-16 bg-[var(--color-dash-surface3)] rounded" />
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="mx-2 my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (Active Projects) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="h-[400px] bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
            <div className="h-5 w-40 bg-[var(--color-dash-surface3)] rounded mb-6" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="h-12 w-12 rounded bg-[var(--color-dash-surface2)]" />
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <div className="h-4 w-3/4 bg-[var(--color-dash-surface2)] rounded" />
                  <div className="h-3 w-1/2 bg-[var(--color-dash-surface3)] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Budget & Activity) */}
        <div className="flex flex-col gap-4">
          <div className="h-[250px] bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
            <div className="flex justify-between items-end mb-6">
               <div className="flex flex-col gap-2">
                 <div className="h-3 w-20 bg-[var(--color-dash-surface3)] rounded" />
                 <div className="h-6 w-32 bg-[var(--color-dash-surface2)] rounded" />
               </div>
               <div className="flex gap-4">
                 <div className="h-8 w-12 bg-[var(--color-dash-surface3)] rounded" />
                 <div className="h-8 w-12 bg-[var(--color-dash-surface3)] rounded" />
               </div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-2">
                  <div className="h-3 w-24 bg-[var(--color-dash-surface3)] rounded" />
                  <div className="h-3 w-16 bg-[var(--color-dash-surface3)] rounded" />
                </div>
                <div className="h-1.5 w-full bg-[var(--color-dash-surface2)] rounded-full" />
              </div>
            ))}
          </div>

          <div className="h-[300px] bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
            <div className="h-5 w-32 bg-[var(--color-dash-surface3)] rounded mb-6" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 mb-4 items-start">
                 <div className="h-8 w-8 rounded-full bg-[var(--color-dash-surface2)] shrink-0" />
                 <div className="flex-1 flex flex-col gap-2 pt-1">
                   <div className="h-3 w-full bg-[var(--color-dash-surface2)] rounded" />
                   <div className="h-3 w-2/3 bg-[var(--color-dash-surface3)] rounded" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
