import { GetMyProfile } from "../data/user/GetMyProfile";
import ProfileClient from "./_components/ProfileClient";

export default async function ProfilePage() {
    const data = await GetMyProfile();

  return <ProfileClient data={data} />;

}
