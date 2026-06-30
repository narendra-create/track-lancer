import { PendingProjects } from "@/app/components/PendingProjects";

// Mock data to prevent page break until backend is connected
const mockPendingProjects = [
  {
    id: "proj_1",
    title: "E-commerce Platform Redesign",
    agreedcost: 85000,
    deadline: "2024-12-15",
    description: "Complete overhaul of the existing e-commerce platform including new frontend architecture and payment gateway integration.",
  },
  {
    id: "proj_2",
    title: "Mobile App Development",
    agreedcost: 120000,
    deadline: "2025-01-30",
    description: "React Native application for both iOS and Android platforms with offline capabilities.",
  }
];

const UnverifiedProjects = () => {
  const handleRegenerateCode = async (id: string) => {
    "use server";
    return { projectCode: Math.random().toString(36).substring(2, 10).toUpperCase() };
  };

  const handleDelete = async (id: string) => {
    "use server";
  };

  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <PendingProjects 
        projects={mockPendingProjects} 
        handleRegenerateCode={handleRegenerateCode} 
        handleDelete={handleDelete} 
      />
    </main>
  );
};

export default UnverifiedProjects;