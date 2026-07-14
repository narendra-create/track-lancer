"use client";
import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import type { NewProjectType } from "../(protected)/freelancer/new-project/page";
import { useToast } from "./ToastProvider";

interface NewProjectFormProps {
  handleCreate: (
    form: NewProjectType,
  ) => Promise<{ projectCode?: string; error?: string } | void>;
  hasUpi: boolean;
  updateUPI: (data: {
    upiId: string;
    AccountHolderName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function NewProjectForm({
  handleCreate,
  hasUpi,
  updateUPI,
}: NewProjectFormProps) {
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
  const [showUpiError, setShowUpiError] = useState(false);
  const [skipChecked, setSkipChecked] = useState(false);
  const [upiData, setUpiData] = useState({ upiId: "", AccountHolderName: "" });
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isValidUpi = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(
    upiData.upiId,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 40) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const proceedWithCreate = async () => {
    setLoading(true);
    const result = await handleCreate(form);
    setLoading(false);

    if (result && result.error) {
      addToast({
        title: "Error",
        message: result.error,
        type: "error",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowUpiError(false);

    if (!hasUpi && !skipChecked) {
      if (!isConfirmed) {
        setShowUpiError(true);
        addToast({
          title: "Action Required",
          message:
            "Please enter your UPI details, verify the QR code and confirm, or check 'Skip for now' to continue.",
          type: "error",
        });
        return;
      }

      // Save UPI if they filled it and didn't check skip
      setLoading(true);
      const result = await updateUPI(upiData);
      if (result.error) {
        setLoading(false);
        addToast({
          title: "Error",
          message: result.error,
          type: "error",
        });
        return;
      }
      // Assuming UPI saved, proceed with creation
      setLoading(false); // proceedWithCreate handles its own loading state
    }

    await proceedWithCreate();
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
        type: "error",
      });
    }
  };

  const handleCheck = () => {
    if (!upiData.upiId || !upiData.AccountHolderName) {
      addToast({
        title: "Error",
        message: "Both UPI ID and Holder Name are required",
        type: "error",
      });
      return;
    }
    if (isValidUpi) {
      setCheckSuccess(true);
    } else {
      setCheckSuccess(false);
      addToast({
        title: "Error",
        message: "Invalid UPI ID format",
        type: "error",
      });
    }
  };

  const qrDataUrl = checkSuccess
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upiData.upiId}&pn=${upiData.AccountHolderName}`)}`
    : "";
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const minDate = today.toISOString().slice(0, 10);

  return (
    <div className="w-full max-w-5xl relative">
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
              <h2 className="font-serif text-2xl text-white mb-2">
                Project Created
              </h2>
              <p className="font-sans text-sm text-[#7a7570]">
                Share this code with your client. They need it to accept the
                project.
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
                {copied ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Code Modal remains unchanged above */}

      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl text-[#e8dfce] mb-2 flex items-center gap-2">
          <span className="text-white">New</span> Project
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#7a7570]">
          Generate client code
        </p>
      </div>

      <div className="w-full h-px bg-[#2a2a2a] mb-8" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        <div className="flex-1 flex flex-col gap-6 w-full">
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
                min={minDate}
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
        </div>

        {/* Inline UPI Section - Right Column */}
        {!hasUpi && (
          <div className="w-full lg:w-[380px] shrink-0 sticky top-4">
            <div
              className={`p-6 rounded-xl border ${showUpiError ? "border-red-500/50 bg-red-500/5" : "border-[#3a3a3a] bg-[#1a1a1a]"} transition-colors duration-300`}
            >
              <div className="mb-5">
                <h3 className="font-serif text-[18px] text-white mb-1 flex items-center gap-2">
                  <span className="text-amber-500">⚠️</span> Payment Details
                  Missing
                </h3>
                <p className="font-sans text-[12px] text-[#7a7570]">
                  You need a UPI ID to receive payments. Enter it now or skip
                  for later.
                </p>
              </div>

              {!skipChecked && (
                <div className="flex flex-col gap-5 mb-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="AccountHolderName"
                      className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
                    >
                      Account Holder Name
                    </label>
                    <input
                      id="AccountHolderName"
                      type="text"
                      placeholder="John Doe"
                      value={upiData.AccountHolderName}
                      onChange={(e) => {
                        setUpiData({
                          ...upiData,
                          AccountHolderName: e.target.value,
                        });
                        setCheckSuccess(false);
                        setIsConfirmed(false);
                        if (showUpiError) setShowUpiError(false);
                      }}
                      className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3 font-sans text-[13px] text-white focus:outline-none focus:border-[#7a7570] duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label
                      htmlFor="upiId"
                      className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
                    >
                      UPI ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="upiId"
                        type="text"
                        placeholder="name@okbank"
                        value={upiData.upiId}
                        onChange={(e) => {
                          setUpiData({ ...upiData, upiId: e.target.value });
                          setCheckSuccess(false);
                          setIsConfirmed(false);
                          if (showUpiError) setShowUpiError(false);
                        }}
                        className={`flex-1 min-w-0 bg-[#1e1e1e] border ${upiData.upiId && !isValidUpi ? "border-red-500/50" : "border-[#2a2a2a]"} rounded-md px-4 py-3 font-sans text-[13px] text-white focus:outline-none focus:border-[#7a7570] duration-200`}
                      />
                      <button
                        type="button"
                        onClick={handleCheck}
                        className="px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[#3a3a3a] transition-colors"
                      >
                        Check
                      </button>
                    </div>
                  </div>

                  {checkSuccess && (
                    <div className="mt-3 border border-[#2a2a2a] rounded-xl p-5 bg-[#1e1e1e] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                      <p className="font-serif text-[15px] text-white mb-3 text-center">
                        Confirm your UPI ID
                      </p>
                      <div className="bg-white p-2 rounded-lg mb-4">
                        <img
                          src={qrDataUrl}
                          alt="UPI QR Code"
                          className="w-[100px] h-[100px]"
                        />
                      </div>
                      <p className="text-center text-[#7a7570] font-sans text-[11px] mb-5 max-w-[240px]">
                        Scan this QR code with your UPI app to verify that it
                        shows your name correctly.
                      </p>

                      {!isConfirmed ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsConfirmed(true);
                            if (showUpiError) setShowUpiError(false);
                          }}
                          className="px-5 py-2.5 bg-green-500/10 border border-green-500/30 rounded-md text-green-500 font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-green-500/20 transition-all duration-200 flex items-center gap-2"
                        >
                          <Check size={14} />
                          Yes, it is correct
                        </button>
                      ) : (
                        <div className="px-5 py-2.5 bg-transparent border border-green-500/30 rounded-md text-green-500 font-mono text-[10px] uppercase tracking-[1.5px] flex items-center gap-2">
                          <Check size={14} />
                          Confirmed
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`flex items-center gap-4 ${skipChecked ? "" : "pt-5 border-t border-[#2a2a2a]"}`}
              >
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={skipChecked}
                      onChange={(e) => {
                        setSkipChecked(e.target.checked);
                        if (showUpiError) setShowUpiError(false);
                      }}
                      className="appearance-none w-6 h-6 border-2 border-[#5a5652] rounded-md checked:bg-brand-surface checked:border-brand-surface transition-all cursor-pointer group-hover:border-brand-surface"
                    />
                    {skipChecked && (
                      <Check
                        size={16}
                        className="absolute text-ink pointer-events-none"
                      />
                    )}
                  </div>
                  <span className="font-sans text-[13px] text-white select-none">
                    Skip adding UPI for now
                  </span>
                </label>
              </div>

              {showUpiError && (
                <p className="font-sans text-[11px] text-red-400 mt-4 bg-red-500/10 p-3 rounded border border-red-500/20">
                  Please verify your UPI details by checking the QR code or
                  check the skip box before generating the project code.
                </p>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
