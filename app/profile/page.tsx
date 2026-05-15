import { requireCompleteProfile } from "@/lib/requireCompleteProfile";
import { GetMyProfile } from "../data/user/GetMyProfile";
import ProfileClient from "./_components/ProfileClient";
import { requireStudent } from "@/lib/requireStudents";

export default async function ProfilePage() {
  await requireCompleteProfile()
  await requireStudent()
    const data = await GetMyProfile();

  return <ProfileClient data={data} />;

}
