import { prisma } from "@/app/lib/prisma";
import type { Categorys } from "@/app/generated/prisma/enums";

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
