import { GetLecturerProfile } from "@/app/data/lecturer/GetLecturerProfile";
import EditLecturerProfileClient from "./_components/EditLecturerProfileClient";

export default async function EditLecturerProfile(){
    const data = await GetLecturerProfile()
    return <EditLecturerProfileClient data={data}/>
}