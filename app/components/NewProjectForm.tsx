"use client";
import { useState } from "react";

export function NewProjectForm() {
  const [form, setForm] = useState({
    title: "",
    clientEmail: "",
    totalAmount: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", form);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl text-[#e8dfce] mb-2 flex items-center gap-2">
          <span className="text-white">New</span> Project
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#7a7570]">
          Generate client code
        </p>
      </div>

      <div className="w-full h-px bg-[#2a2a2a] mb-8" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Project Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
          >
            Project Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. E-commerce Platform"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
              font-sans text-[14px] text-white placeholder:text-[#4a4642]
              focus:outline-none focus:border-[#7a7570] duration-200"
          />
        </div>

        {/* 2 Column Row: Email and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="clientEmail"
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
            >
              Client Email (Optional)
            </label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={form.clientEmail}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
                font-sans text-[14px] text-white placeholder:text-[#4a4642]
                focus:outline-none focus:border-[#7a7570] duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="totalAmount"
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
            >
              Total Amount (₹)
            </label>
            <input
              id="totalAmount"
              name="totalAmount"
              type="number"
              placeholder="85,000"
              value={form.totalAmount}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
                font-sans text-[14px] text-white placeholder:text-[#4a4642]
                focus:outline-none focus:border-[#7a7570] duration-200"
            />
            <p className="font-sans text-[10px] text-[#5a5652] leading-snug mt-1">
              Milestones created later cannot exceed this agreed-upon total budget.
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-2 w-full md:w-[calc(50%-12px)]">
          <label
            htmlFor="deadline"
            className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
          >
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            placeholder="YYYY-MM-DD"
            value={form.deadline}
            onChange={handleChange}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
              font-sans text-[14px] text-white placeholder:text-[#4a4642]
              focus:outline-none focus:border-[#7a7570] duration-200 [color-scheme:dark]"
          />
        </div>

        {/* Brief Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
          >
            Brief Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="What this covers..."
            value={form.description}
            onChange={handleChange}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
              font-sans text-[14px] text-white placeholder:text-[#4a4642]
              focus:outline-none focus:border-[#7a7570] duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <p className="font-sans text-[11px] text-[#5a5652] mb-5">
            By creating this project, you agree that all subsequent milestone costs will not exceed the stated total amount.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-transparent border border-[#3a3a3a] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[#1a1a1a] hover:border-[#4a4a4a] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create & Generate Code"}
            <span className="text-[14px] font-sans">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
