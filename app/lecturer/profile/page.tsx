import { GetLecturerProfile } from "../GetLecturerProfile";
import LecturerProfileClient from "./_components/LecturerProfileClient";

export default async function LecturerProfile(){
    const data = await GetLecturerProfile()
    return(
        <LecturerProfileClient data={data} />
    )
}