import { requireRole } from "@/lib/requireRole";
import { UserStatus } from "@prisma/client";

export default async function LecturerPage() {
      await requireRole([UserStatus.LECTURER]);
    return(
        <div>
        <h1>
            Annie are you ok?
        </h1>
        </div>
    )
}