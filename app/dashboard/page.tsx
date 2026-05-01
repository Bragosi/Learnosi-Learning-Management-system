import { EmptyState } from "@/components/general/EmptyState";
import { GetAllCourses } from "../data/PublicCourse/GetAllCourses";
import { GetEnrolledCourses } from "../data/user/GetEnrolledCourses";
import PublicCourseCard from "../(home)/_components/PublicCourseCard";
import CourseProgressCard from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    GetAllCourses(),
    GetEnrolledCourses(),
  ]);
  const availableCourses = courses.filter(
    (course) => !enrolledCourses.some((enrolled) => enrolled.id === course.id),
  );
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Registered Courses</h1>
        <p className="text-muted-foreground ">
          Here you can see all the courses you registered for
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No registered Courses"
          description="You have not registered for any course"
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.id} data={course} />
          ))}
        </div>
      )}
      <section className="mt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can register for
          </p>
        </div>
        <div className="mt-4">
          {availableCourses.length === 0 ? (
            <EmptyState
              title="No courses available"
              description={"You have registered for all available course"}
              buttonText={"Back to home page"}
              href={"/"}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
