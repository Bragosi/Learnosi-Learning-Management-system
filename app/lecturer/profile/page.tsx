import { buttonVariants } from "@/components/ui/button";
import { Edit} from "lucide-react";
import Link from "next/link";
import { GetLecturerProfile } from "../GetLecturerProfile";
import LecturerProfileClient from "./_components/LecturerProfileClient";

export default async function LecturerProfile(){
    const data = await GetLecturerProfile()
    return(
        <LecturerProfileClient data={data} />
    )
}