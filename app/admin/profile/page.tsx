

import { GetAdminProfile } from "@/app/data/admin/GetAdminProfile";
import AdminProfileClient from "./_components/AdminProfileClient";
import { requireAdminCompleteProfile } from "@/lib/requireAdminCompleteProfile";

export default async function AdminProfile(){
    await requireAdminCompleteProfile()
    const data = await GetAdminProfile()
    return(
        <AdminProfileClient data={data} />
    )
}