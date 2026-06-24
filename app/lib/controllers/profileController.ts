import { prisma } from "@/app/lib/prisma";
import type { Categorys } from "@/app/generated/prisma/enums";
import type { ChartDataPoint } from "@/app/components/FreelancerChart";

export const addprofile = async (
  userId: string,
  role: string,
  category?: Categorys,
) => {
  if (role === "client") {
    const profile = await prisma.userprofile.upsert({
      where: { userId },
      create: { userId },
      update: {},
      select: { id: true },
    });
    return { success: true, Profile: profile };
  }

  if (role === "freelancer" && category) {
    const profile = await prisma.freelancer.upsert({
      where: { userId },
      create: { userId, category },
      update: { category },
      select: {
        id: true,
        category: true,
      },
    });
    return { success: true, Profile: profile };
  }

  return { success: false };
};

export const getClientProfile = async (email: string) => {
  const foundclient = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      role: true,
      name: true,
      image: true,
      userprofiles: {
        select: {
          id: true
        }
      }
    }
  });

  return { success: true, profile: foundclient }
}

export const getFreelancerProfile = async (email: string) => {
  const foundfreelancer = await prisma.user.findUnique({
    where: { email: email },
    select: {
      name: true,
      image: true,
      Freelancer: {
        select: {
          id: true,
          category: true,
        }
      }
    }
  });
  return { success: true, profile: foundfreelancer }
}