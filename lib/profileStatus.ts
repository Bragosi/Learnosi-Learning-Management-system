// lib/profile-status.ts
import { GetMyProfileType } from "@/app/data/user/GetMyProfile";

export function isProfileComplete(data: GetMyProfileType) {
  const profile = data.profile;

  if (!profile) return false;

  return (
    !!profile.firstName &&
    !!profile.lastName &&
    !!profile.matricNumber &&
    !!profile.department &&
    !!profile.faculty &&
    !!profile.level
  );
}