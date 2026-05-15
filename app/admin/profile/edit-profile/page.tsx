import EditAdminProfileClient from "./_components/EditAdminProfileClient";
import { GetAdminProfile } from "@/app/data/admin/GetAdminProfile";

export default async function EditLecturerProfile(){
    const data = await GetAdminProfile()
    return <EditAdminProfileClient data={data}/>
}