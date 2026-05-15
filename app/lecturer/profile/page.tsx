import { requireLectureCompleteProfile } from "@/lib/requireLecturerCompleteProfile";
import { GetLecturerProfile } from "../../data/lecturer/GetLecturerProfile";
import LecturerProfileClient from "./_components/LecturerProfileClient";

export default async function LecturerProfile(){
    await requireLectureCompleteProfile()
    const data = await GetLecturerProfile()
    return(
        <LecturerProfileClient data={data} />
    )
}