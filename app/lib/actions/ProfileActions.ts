"use server";

import { updateProfile, getSettingsProfile } from "../controllers/profileController";
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
