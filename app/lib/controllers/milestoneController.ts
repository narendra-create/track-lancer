import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../require-role";
import { getClientProfile, getFreelancerProfile } from "./profileController";
import type { createMilestoneInput } from "../validations/MilestoneValidation";
import { userrole } from "@/app/generated/prisma/enums";

export const createMilestone = async (input: createMilestoneInput) => {
    const { session, error, status } = await requireRole("freelancer");
    if (error) {
        return { success: false, error: error, status: status }
    };
    if (!session?.user) {
        return { success: false, error: "You are logged out", status: 401 };
    }
    const profile = await getFreelancerProfile(session?.user.email);
    if (!profile) {
        return { success: false, error: "Profile Not found", status: 404 }
    }

    const project = await prisma.project.findUnique({
        where: { id: input.projectId, freelancerId: profile.profile?.Freelancer?.id },
    })
    //If freelancer is trying to add milestone in someone else's project
    if (!project) {
        return { success: false, error: "This project is not associated with your account", status: 403 };
    };

    if (project.status !== "ACTIVE") {
        return { success: false, error: "Milestones can only be created for active projects", status: 422 };
    }

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
};

export const getAllMilestones = async (projectId: string, profileId: string, role: userrole) => {
    if (!projectId) {
        return { success: false, error: "Provide projectId", status: 400 };
    };

    if (role === "FREELANCER") {
        const findproject = await prisma.project.findUnique({
            where: { id: projectId, freelancerId: profileId }
        });
        if (!findproject) {
            return { success: false, error: "This project is not associated with your account" };
        };

        try {
            const result = await prisma.milestone.findMany({
                where: { projectId: findproject.id },
                select: {
                    id: true,
                    title: true,
                    deadline: true,
                    subtitle: true,
                    description: true,
                    delay: true,
                    delayreason: true,
                    createdAt: true,
                    milestonecost: true,
                    status: true
                }
            });

            return { success: true, milestones: result, status: 200 };
        }
        catch (err: any) {
            if (err.error) {
                return { success: false, error: err.error, status: 500 }
            }
            console.log(err, "From creatMilestone");
            return { success: false, error: "Server Error", status: 500 };
        }
    }
    else if (role === "CLIENT") {
        const findproject = await prisma.project.findUnique({
            where: { id: projectId, clientId: profileId }
        });
        if (!findproject) {
            return { success: false, error: "This project is not associated with your account" };
        };

        try {
            const result = await prisma.milestone.findMany({
                where: { projectId: findproject.id },
                select: {
                    id: true,
                    title: true,
                    deadline: true,
                    subtitle: true,
                    description: true,
                    delay: true,
                    delayreason: true,
                    createdAt: true,
                    milestonecost: true,
                    status: true
                }
            });

            return { success: true, milestones: result, status: 200 };
        }
        catch (err: any) {
            if (err.error) {
                return { success: false, error: err.error, status: 500 }
            }
            console.log(err, "From creatMilestone");
            return { success: false, error: "Server Error", status: 500 };
        }
    }
    return { success: false, error: "Invalid role", status: 400 };
}

export const stopProject = async (projectId: string) => {
    const { session, error, status } = await requireRole("client");
    if (error) {
        return { success: false, error: error, status: status }
    };
    if (!session?.user) {
        return { success: false, error: "You are logged out", status: 401 };
    }
    const profile = await getClientProfile(session.user.email);
    if (!profile) {
        return { success: false, error: "Profile Not found", status: 404 }
    };

    const findproject = await prisma.project.findUnique({
        where: { id: projectId, clientId: profile.profile?.id }
    });
    if (!findproject) {
        return { success: false, error: "You can only edit your projects", status: 403 }
    };
    if (findproject.status === "PENDING" || findproject.status === "COMPLETED" || findproject.status === "CANCELLED") {
        return { success: false, error: "Project is not Active", status: 400 }
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: {
                    status: "STOPPED",
                    stoppedAt: new Date(Date.now())
                }
            })
            await tx.milestone.updateMany({
                where: { projectId: projectId, project: { clientId: profile.profile?.id }, status: "NOT_STARTED" },
                data: {
                    status: "STOPPED"
                }
            })
        });

        return { success: true, status: 200 };
    }
    catch (err: any) {
        if (err.error) {
            return { sucess: false, error: err.error, status: 500 }
        };
        console.log(err, "From stopProject");
        return { success: false, error: "Server Error", status: 500 }
    }
}