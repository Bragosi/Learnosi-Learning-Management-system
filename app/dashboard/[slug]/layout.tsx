import { ReactNode } from "react";
import { CourseSideBar } from "../_components/CourseSideBar";
import { GetCourseSideBarData } from "@/app/data/PublicCourse/GetCourseSideBarData";

interface iAppProps{
    params : Promise<{slug : string}>
    children : ReactNode
}

export default async function PublicCourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;
  const course = await GetCourseSideBarData(slug);

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <div className="
        hidden md:flex 
        md:w-72 lg:w-80 
        border-r border-border 
        flex-col
      ">
        <CourseSideBar course={course.course} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}