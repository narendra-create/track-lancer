"use server";

import { updateProfile, getSettingsProfile, updateUPIDetails } from "../controllers/profileController";
import { updateblockNotification } from "../controllers/activityController";
import type { ActivityType } from "@/app/generated/prisma/enums";
import type { updateProfileInput } from "../validations/ProfileValidation";
import { revalidatePath } from "next/cache";

export async function getProfileAction() {
  return await getSettingsProfile();
}

export async function updateProfileAction(data: updateProfileInput) {
  const result = await updateProfile(data);
  if (result.success) {
    revalidatePath("/freelancer/settings");
    revalidatePath("/client/settings");
  }
  return result;
}

export async function updateUPIDetailsAction(data: { upiId: string, AccountHolderName: string }) {
  const result = await updateUPIDetails(data);
  if (result.success) {
    revalidatePath("/freelancer/settings");
  }
  return result;
}

export async function updateBlockNotificationAction(input: ActivityType[]) {
  const result = await updateblockNotification(input);
  if (result && result.success) {
    revalidatePath("/freelancer/settings");
    revalidatePath("/client/settings");
  }
  return result;
}
