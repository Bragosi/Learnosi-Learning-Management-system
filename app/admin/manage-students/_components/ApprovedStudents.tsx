"use client";

import { AdminGetApprovedStudentsType } from "@/app/data/admin/AdminGetApprovedStudents";
import { RevokeUserAccess } from "./RevokeUserAccess";
import { EmptyState } from "@/components/general/EmptyState";

interface iAppProps {
  data: AdminGetApprovedStudentsType;
}

export default function ApprovedStudents({ data }: iAppProps) {
  return (
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="flex text-sm font-medium text-muted-foreground border-b pb-2">
        <div className="w-1/3">Matric Number</div>
        <div className="w-1/3 text-center">Faculty</div>
        <div className="w-1/3 text-right">Action</div>
      </div>

      {/* Rows */}
      {data?.length === 0 ? (
        <EmptyState
          title="No Approved Students"
          description={"Give students authorization to Learnosi"}
          buttonText={"Add student"}
          href={""}
        />
      ) : (
        data.map((student) => (
          <div
            key={student.id}
            className="flex items-center border rounded-md px-3 py-2 hover:bg-muted/40 transition"
          >
            {/* Matric */}
            <div className="w-1/3 font-medium">{student.matricNumber}</div>

            {/* Faculty */}
            <div className="w-1/3 text-center text-muted-foreground">
              {student.faculty}
            </div>

            {/* Delete */}
            <div className="w-1/3 flex justify-end">
              <RevokeUserAccess student={student} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
