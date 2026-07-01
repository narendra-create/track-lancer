import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../require-role";
import { getFreelancerProfile } from "./profileController";
import type { createMilestoneInput } from "../validations/MilestoneValidation";

export const createMilestone = async (input: createMilestoneInput) => {
    const { session, error, status } = await requireRole("freelancer");
    if (error) {
        return { success: false, error: error, status: status }
    };
    if (!session?.user) {
        return { success: false, error: "You are logged out", status: 401 };
    }
    const profile = await getFreelancerProfile(session?.user.email);

    const project = await prisma.project.findUnique({
        where: { id: input.projectId, freelancerId: profile.profile?.Freelancer?.id },
    })
    //If freelancer is trying to add milestone in someone else's project
    if (!project) {
        return { success: false, error: "This project is not associated with your account" };
    };

    try {
        const createdMilestone = await prisma.milestone.create({
            data: {
                projectId: project.id,
                title: input.title,
                subtitle: input.subtitle ?? null,
                milestonecost: input.cost,
                description: input.description ?? null,
                status: "IN_PROGRESS",
                delay: false,
                deadline: new Date(input.deadline)
            }
        });

        return { success: true, milestone: createdMilestone, status: 201 };
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: 500 }
        }
        console.log(err, "From creatMilestone");
        return { success: false, error: "Server Error", status: 500 };
    }
}