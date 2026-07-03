import { NewProjectForm } from "@/app/components/NewProjectForm";
import { createNewProject } from "@/app/lib/controllers/ProjectController";
import { newProjectSchema } from "@/app/lib/validations/ProjectValidation";
import type { newProjectInput } from "@/app/lib/validations/ProjectValidation";

export type NewProjectType = {
  title: string;
  agreedcost: string;
  deadline: string;
  description?: string;
};

const NewProject = () => {
  const createNew = async (form: NewProjectType) => {
    "use server";
    const payload: newProjectInput = {
      title: form.title,
      agreedcost: Number(form.agreedcost),
      deadline: new Date(form.deadline),
      description: form.description,
    };

    const parsed = newProjectSchema.safeParse(payload);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }
    const result = await createNewProject(parsed.data);
    if (!result.success) {
      return { error: `Can't create project - ${result.status}, cause - ${result.error}` };
    }
    return { projectCode: result.projectCode };
  };

  return (
    <div className="lg:pl-11 lg:pt-14 mx-4">
      <NewProjectForm handleCreate={createNew} />
    </div>
  );
};

export default NewProject;
