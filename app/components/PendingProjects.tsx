"use client";
import { useState, useEffect } from "react";
import { Copy, Check, X, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export type PendingProject = {
  id: string;
  title: string;
  agreedcost: number;
  deadline: string;
  description?: string;
};

interface PendingProjectsProps {
  projects: PendingProject[];
  handleRegenerateCode: (id: string) => Promise<{ projectCode?: string } | void>;
  handleDelete: (id: string) => Promise<void>;
}

export function PendingProjects({ projects, handleRegenerateCode, handleDelete }: PendingProjectsProps) {
  const router = useRouter();
  const [projectCode, setProjectCode] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (projectCode || deleteConfirmId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [projectCode, deleteConfirmId]);


  const onRegenerate = async (id: string) => {
    setLoadingId(id);
    const result = await handleRegenerateCode(id);
    setLoadingId(null);
    if (result && result.projectCode) {
      setProjectCode(result.projectCode);
    }
  };

  const confirmDelete = async (id: string) => {
    setDeletingId(id);
    await handleDelete(id);
    setDeletingId(null);
    setDeleteConfirmId(null);
    router.refresh();
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
      console.error("Failed to copy", error);
    }
  };

  return (
    <div className="w-full max-w-6xl relative">
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
              <h2 className="font-serif text-2xl text-white mb-2">New Code Generated</h2>
              <p className="font-sans text-sm text-[#7a7570]">
                Share this new code with your client. Any previous codes for this project are now invalid.
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h2 className="font-serif text-2xl text-white mb-2">Delete Project?</h2>
              <p className="font-sans text-sm text-[#7a7570]">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deletingId === deleteConfirmId}
                className="flex-1 px-4 py-2 bg-transparent border border-[#3a3a3a] rounded-md text-white font-mono text-[11px] uppercase tracking-[1px] hover:bg-[#2a2a2a] transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 font-mono text-[11px] uppercase tracking-[1px] hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingId === deleteConfirmId ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl text-[#e8dfce] mb-2 flex items-center gap-2">
          <span className="text-white">Pending</span> Projects
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#7a7570]">
          Awaiting Client Verification
        </p>
      </div>

      <div className="w-full h-px bg-[#2a2a2a] mb-8" />

      {projects.length === 0 ? (
        <div className="text-center py-12 border border-[#2a2a2a] rounded-xl bg-[#1e1e1e]">
          <p className="font-mono text-sm text-[#7a7570]">No pending projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={project.id} 
                className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors duration-200 flex flex-col"
              >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[1px] text-[#7a7570]">
                    <span>Amount: <strong className="text-white">₹{project.agreedcost.toLocaleString()}</strong></span>
                    <span>Deadline: <strong className="text-white">{project.deadline}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRegenerate(project.id)}
                    disabled={loadingId === project.id}
                    className="px-4 py-2 bg-transparent border border-[#3a3a3a] rounded-md text-white font-mono text-[10px] uppercase tracking-[1px] hover:bg-[#2a2a2a] hover:border-[#4a4a4a] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerate Code"
                  >
                    <RefreshCw size={14} className={loadingId === project.id ? "animate-spin" : ""} />
                    {loadingId === project.id ? "Wait..." : "Code"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2 bg-transparent border border-[#3a3a3a] rounded-md text-[#7a7570] hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {project.description && (
                <div className="bg-black/20 border border-[#2a2a2a] rounded-lg p-4 mt-auto overflow-hidden">
                  <p className="font-sans text-[13px] text-[#a09b96] leading-relaxed break-words whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>
              )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
