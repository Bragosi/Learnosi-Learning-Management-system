import { GetMyProfile } from "@/app/data/user/GetMyProfile";
import EditProfileClient from "./EditProfileClient";


export default async function EditProfilePage() {
  const data = await GetMyProfile();
  return <EditProfileClient data={data} />;
}
