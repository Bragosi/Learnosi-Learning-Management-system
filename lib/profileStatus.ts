// lib/profile-status.ts
import { GetMyProfileType } from "@/app/data/user/GetMyProfile";
import { GetLecturerProfileType } from "@/app/data/lecturer/GetLecturerProfile";

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


export function isLecturerProfileComplete(data : GetLecturerProfileType){
    const profile = data.lecturerProfile;

  if (!profile) return false;

  return (
    !!profile.firstName &&
    !!profile.lastName &&
    !!profile.profilePicture &&
    !!profile.department &&
    !!profile.faculty &&
    !!profile.employeeId
  );
}