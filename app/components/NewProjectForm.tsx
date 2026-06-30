"use client";
import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import type { NewProjectType } from "../(protected)/freelancer/new-project/page";
import { useToast } from "./ToastProvider";

interface NewProjectFormProps {
  handleCreate: (form: NewProjectType) => Promise<{ projectCode?: string; error?: string } | void>;
}

export function NewProjectForm({ handleCreate }: NewProjectFormProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    agreedcost: "",
    deadline: "",
    description: "",
  });
  const [projectCode, setProjectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 40) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await handleCreate(form);
    setLoading(false);

    if (result && result.error) {
      addToast({
        title: "Error",
        message: result.error,
        type: "error"
      });
      return;
    }

    if (result && result.projectCode) {
      setProjectCode(result.projectCode);
      setForm({
        title: "",
        agreedcost: "",
        deadline: "",
        description: "",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(projectCode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = projectCode;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        title: "Copy Failed",
        message: "Failed to copy code to clipboard.",
        type: "error"
      });
    }
  };

  return (
    <div className="w-full max-w-2xl relative">
      {/* Project Code Modal */}
      {projectCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setProjectCode("")}
              className="absolute top-4 right-4 text-[#7a7570] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#3a3a3a]">
                <Check className="text-green-500" size={24} />
              </div>
              <h2 className="font-serif text-2xl text-white mb-2">Project Created</h2>
              <p className="font-sans text-sm text-[#7a7570]">
                Share this code with your client. They need it to accept the project.
              </p>
              <p className="font-sans text-xs text-amber-500/80 mt-3 font-medium bg-amber-500/10 py-2 px-3 rounded-md inline-block">
                ⚠️ This code is only shown once. Please save it now.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-black/40 border border-[#2a2a2a] rounded-lg p-3 mt-4">
              <code className="flex-1 font-mono text-xl text-center text-white tracking-wider">
                {projectCode}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#7a7570] hover:text-white"
                title="Copy code"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex justify-between items-end">
            <label
              htmlFor="title"
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
            >
              Project Title
            </label>
            <span className="font-sans text-[10px] text-[#5a5652]">
              {form.title.length}/40
            </span>
          </div>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. E-commerce Platform"
            value={form.title}
            onChange={handleChange}
            maxLength={40}
            required
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
              font-sans text-[14px] text-white placeholder:text-[#4a4642]
              focus:outline-none focus:border-[#7a7570] duration-200"
          />
        </div>

        {/* 2 Column Row: Amount and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="agreedcost"
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
            >
              Agreed Amount (₹)
            </label>
            <input
              id="agreedcost"
              name="agreedcost"
              type="number"
              placeholder="85,000"
              value={form.agreedcost}
              onChange={handleChange}
              required
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
                font-sans text-[14px] text-white placeholder:text-[#4a4642]
                focus:outline-none focus:border-[#7a7570] duration-200"
            />
            <p className="font-sans text-[10px] text-[#5a5652] leading-snug mt-1">
              Milestones created later cannot exceed this budget.
            </p>
          </div>

          <div className="flex flex-col gap-2">
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
              required
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
                font-sans text-[14px] text-white placeholder:text-[#4a4642]
                focus:outline-none focus:border-[#7a7570] duration-200 [color-scheme:dark]"
            />
          </div>
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
            By creating this project, you agree that all subsequent milestone
            costs will not exceed the stated total amount.
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
