import { prisma } from "@/app/lib/prisma";
import type { Categorys } from "@/app/generated/prisma/enums";
import { getSession } from "@/app/lib/session";
import { updateProfileInput } from "../validations/ProfileValidation";
import { headers } from "next/headers";
import { actionRateLimit } from "../rate-limit";

export const addprofile = async (
  userId: string,
  role: string,
  category?: Categorys,
) => {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const { success } = await actionRateLimit.limit(ip);

  if (!success) {
    return {
      success: false,
      error: "Rate limit exceeded. Try again later.",
      status: 429
    }
  }
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

export const updateProfile = async (data: updateProfileInput) => {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const { success } = await actionRateLimit.limit(ip);

  if (!success) {
    return {
      success: false,
      error: "Rate limit exceeded. Try again later.",
      status: 429
    }
  }
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized", status: 401 };
  const role = session.user.role.toLowerCase();
  if (role !== "client" && role !== "freelancer") return { success: false, error: "Forbidden", status: 403 };
  if (role === "client") {
    const findProfile = await prisma.userprofile.findUnique({
      where: { userId: session.user.id }
    });

    if (!findProfile) {
      return { success: false, error: "Profile Not found", status: 404 }
    };

    const updateData: any = {
      ...data,
    };

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No data provided", status: 400 };
    }

    if (data.name !== undefined) {
      updateData.user = {
        update: {
          name: data.name,
        },
      };
      delete updateData.name;
    }
    try {
      await prisma.userprofile.update({
        where: { id: findProfile.id },
        data: updateData
      });

      return { success: true, message: "Success", status: 200 };
    }
    catch (err) {
      return {
        success: false,
        error: "Server Error",
        status: 500
      };
    }
  }
  else {
    const findProfile = await prisma.freelancer.findUnique({
      where: { userId: session.user.id }
    });

    if (!findProfile) {
      return { success: false, error: "Profile Not found", status: 404 }
    };

    const updateData: any = {
      ...data,
    };

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No data provided", status: 400 };
    }

    if (data.name !== undefined) {
      updateData.user = {
        update: {
          name: data.name,
        },
      };
      delete updateData.name;
    }
    try {
      await prisma.freelancer.update({
        where: { id: findProfile.id },
        data: updateData
      });

      return { success: true, message: "Success", status: 200 };
    }
    catch (err) {
      return {
        success: false,
        error: "Server Error",
        status: 500
      };
    }
  }
}

export const getSettingsProfile = async () => {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const role = session.user.role.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      Freelancer: true,
      userprofiles: true,
    },
  });

  if (!user) return { success: false, error: "User not found" };

  if (role === "client") {
    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.userprofiles?.phone || "",
        blockedNotificationTypes: user.blockedNotificationTypes || []
      },
    };
  } else {
    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.Freelancer?.phone || "",
        category: user.Freelancer?.category || "",
        upiId: user.Freelancer?.upiId || undefined,
        AccountHolderName: user.Freelancer?.AccountHolderName || undefined,
        blockedNotificationTypes: user.blockedNotificationTypes || []
      },
    };
  }
};

export const updateUPIDetails = async (data: { upiId: string, AccountHolderName: string }) => {
      const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { success } = await actionRateLimit.limit(ip);

    if (!success) {
        return {
            success: false,
            error: "Rate limit exceeded. Try again later.",
            status: 429
        }
    }
  const isValidSyntax = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiId);
  if (!isValidSyntax) {
    return { success: false, error: "Enter valid upi id please", status: 400 }
  };
  if (data.AccountHolderName.length <= 3) {
    return { success: false, error: "Account holder name is too short", status: 400 }
  };
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const role = session.user.role.toLowerCase();
  if (role !== "freelancer") { return { success: false, error: "Invalid Role", status: 403 } };


  const findProfile = await prisma.freelancer.findUnique({
    where: { userId: session.user.id }
  });

  if (!findProfile) {
    return { success: false, error: "Profile Not found", status: 404 }
  };

  const updateData: any = {
    ...data,
  };

  if (Object.keys(updateData).length === 0) {
    return { success: false, error: "No data provided", status: 400 };
  }

  try {
    await prisma.freelancer.update({
      where: { id: findProfile.id },
      data: updateData
    });

    return { success: true, message: "Success", status: 200 };
  }
  catch (err) {
    return {
      success: false,
      error: "Server Error",
      status: 500
    };
  }

}