"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ToastProvider";
import type { AcceptProjectDetails } from "@/types/allprojects";

interface AcceptProjectProps {
  acceptProject: (
    projectCode: string,
  ) => Promise<{ projectId?: string; error?: string } | void>;
  searchProject: (
    projectCode: string,
  ) => Promise<{ error?: string; project?: any }>;
}

export function AcceptProject({
  acceptProject,
  searchProject,
}: AcceptProjectProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [projectCode, setProjectCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [projectDetails, setProjectDetails] =
    useState<AcceptProjectDetails | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectCode || projectCode.length !== 8) {
      setSearchError("Please enter a valid 8-character code");
      return;
    }

    setSearchError("");
    setIsSearching(true);
    setProjectDetails(null);

    try {
      const result = await searchProject(projectCode);
      if (result && result.project) {
        const p = result.project;
        setProjectDetails({
          projectId: p.id,
          title: p.title,
          agreedcost: p.agreedCost || 0,
          deadline: p.deadline
            ? new Date(p.deadline).toISOString().split("T")[0]
            : "No deadline",
          description: p.description || "No description provided",
          freelancer: {
            name: p.freelancer?.user?.name || "Unknown",
            email: p.freelancer?.user?.email || "Unknown",
          },
          archivedByClient: false,
          archivedByFreelancer: false,
        });
        addToast({
          title: "Project Found",
          message: "Project details loaded successfully.",
          type: "success",
        });
      } else {
        setSearchError(
          result?.error ||
            "Project not found. Please check the code and try again.",
        );
      }
    } catch (error) {
      setSearchError("An error occurred while searching for the project.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAccept = async () => {
    if (!projectDetails || !projectCode) return;

    setIsAccepting(true);
    try {
      const result = await acceptProject(projectCode);
      if (result && result.error) {
        addToast({
          title: "Error",
          message: result.error,
          type: "error",
        });
      } else if (result && result.projectId) {
        addToast({
          title: "Success",
          message: "Project accepted successfully!",
          type: "success",
        });
        router.push(`/client/milestones/${result.projectId}`);
      } else {
        addToast({
          title: "Success",
          message: "Project accepted successfully!",
          type: "success",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        message: "Something went wrong while accepting the project.",
        type: "error",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="mb-10">
        <button
          onClick={() => window.history.back()}
          className="mb-6 px-4 py-2 bg-transparent border border-[var(--color-dash-border)] rounded-md text-white font-mono text-[10px] lg:text-[12px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-border-hover)] transition-all duration-200 flex items-center gap-2 w-fit"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <h1 className="font-serif text-3xl lg:text-4xl text-[#e8dfce] mb-2 flex items-center gap-2">
          <span className="text-white">Accept</span> Project
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#7a7570]">
          Find and review client project
        </p>
      </div>
      <div className="w-full h-px bg-[#2a2a2a] mb-8" />

      {/* --- Search Section --- */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="projectCode"
            className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
          >
            Project Code
          </label>
          <div className="flex gap-3 items-start">
            <div className="flex-1 flex flex-col gap-2">
              <div className="relative">
                <input
                  id="projectCode"
                  type="text"
                  placeholder="e.g. A1B2C3D4"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
                    font-mono text-[14px] tracking-widest text-white placeholder:text-[#4a4642]
                    focus:outline-none focus:border-[#7a7570] duration-200"
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4642]"
                  size={18}
                />
              </div>
              <AnimatePresence>
                {searchError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-[11px] font-sans flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {searchError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSearching || projectCode.length === 0}
              className="px-6 py-3 bg-transparent border border-[#3a3a3a] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[#1a1a1a] hover:border-[#4a4a4a] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[46px] min-w-[140px]"
            >
              {isSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={14} />
                  </motion.div>
                  Searching
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* --- Project Details Section --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={projectDetails ? "details" : "placeholders"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadOnlyField
              label="Freelancer Name"
              value={projectDetails?.freelancer.name}
              placeholder="Waiting for project code..."
            />
            <ReadOnlyField
              label="Freelancer Email"
              value={projectDetails?.freelancer.email}
              placeholder="Waiting for project code..."
            />
          </div>

          <ReadOnlyField
            label="Project Title"
            value={projectDetails?.title}
            placeholder="Waiting for project code..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadOnlyField
              label="Agreed Amount (₹)"
              value={projectDetails?.agreedcost?.toString()}
              placeholder="Waiting for project code..."
            />
            <ReadOnlyField
              label="Deadline"
              value={projectDetails?.deadline}
              placeholder="Waiting for project code..."
            />
          </div>

          <ReadOnlyField
            label="Brief Description"
            value={projectDetails?.description}
            placeholder="Waiting for project code..."
            isTextArea
          />

          {/* --- Submit Button --- */}
          <div className="mt-4">
            <p className="font-sans text-[11px] text-[#5a5652] mb-5">
              By accepting this project, you agree that all subsequent milestone
              costs will not exceed the stated total amount.
            </p>
            <button
              onClick={handleAccept}
              disabled={!projectDetails || isAccepting}
              className="px-6 py-3 bg-transparent border border-[#3a3a3a] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[#1a1a1a] hover:border-[#4a4a4a] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAccepting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={14} />
                  </motion.div>
                  Accepting...
                </>
              ) : (
                <>
                  Accept Project
                  {projectDetails ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <span className="text-[14px] font-sans">→</span>
                  )}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  placeholder,
  isTextArea = false,
}: {
  label: string;
  value?: string;
  placeholder: string;
  isTextArea?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]">
        {label}
      </label>
      <div
        className={`w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-4 py-3
          font-sans text-[14px] ${value ? "text-white" : "text-[#4a4642] italic"}
          ${isTextArea ? "min-h-[100px] whitespace-pre-wrap" : ""}`}
      >
        {value || placeholder}
      </div>
    </div>
  );
}
