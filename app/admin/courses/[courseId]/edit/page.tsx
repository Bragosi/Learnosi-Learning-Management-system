import { AdminGetSingleCourse } from "@/app/data/admin/admingetSingleCourse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_component/EditCourseForm";
import CourseStructure from "./_component/CourseStructure";
import { requireRole } from "@/lib/requireRole";
import { UserStatus } from "@prisma/client";
type Params = Promise<{ courseId: string }>;

export default async function EditRoute({ params }: { params: Params }) {
  await requireRole([UserStatus.LECTURER, UserStatus.ADMIN]);
  const { courseId } = await params;

  const data = await AdminGetSingleCourse(courseId);
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">
        Edit Course :{" "}
        <span className="text-primary underline">{data.courseTitle}</span>
      </h1>

      <Tabs defaultValue="course-structure" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Edit Basic Information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm value={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                here you can update your course structure{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure
                key={JSON.stringify(data.chapters)}
                data={data}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
