import { GetPublicSingleCourse } from "@/app/data/PublicCourse/GetPublicSingleCourse";
import { env } from "@/lib/env";
import Image from "next/image";
import {
  IconChartBar,
  IconChevronDown,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { levelLabels } from "@/lib/zodSchema";
import { BookOpen, CheckIcon, School } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Card, CardContent } from "@/components/ui/card";
import {
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { RequireUser } from "@/app/data/user/requireUser";
import { prisma } from "@/lib/prisma";
import EnrollButton from "./_component/EnrollButton";
import { Button } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await GetPublicSingleCourse(slug);

  if (!course) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Course not found
      </div>
    );
  }

  const totalLectures = course.chapters.reduce(
    (total, chapter) => total + chapter.lectures.length,
    0,
  );

  const user = await RequireUser();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  const isEnrolled = !!enrollment;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-md group">
            <Image
              src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`}
              alt="course thumbnail"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Course Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {course.courseTitle}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {course.courseCode}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Course Description
              </h2>
              <div className="text-sm sm:text-base">
                <RenderDescription json={JSON.parse(course.description)} />
              </div>
            </div>
          </div>

          {/* COURSE CONTENT */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Course Content
              </h2>
              <p className="text-sm text-muted-foreground">
                {course.chapters.length} Chapters • {totalLectures} Lectures
              </p>
            </div>

            <div className="space-y-3">
              {course.chapters.map((chapter, index) => (
                <Collapsible key={chapter.id} defaultOpen={index === 0}>
                  <Card className="p-0 overflow-hidden border transition hover:shadow-sm">
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-4 sm:p-6 hover:bg-muted/40 transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="flex items-center justify-center size-8 sm:size-10 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>

                            <div className="text-left">
                              <h3 className="text-base sm:text-lg font-semibold">
                                {chapter.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {chapter.lectures.length} lecture
                                {chapter.lectures.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <IconChevronDown className="size-5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t bg-muted/30">
                        <div className="p-3 sm:p-5 space-y-2">
                          {chapter.lectures.map((lecture, i) => (
                            <div
                              key={lecture.id}
                              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-accent transition"
                            >
                              <div className="flex items-center justify-center size-7 sm:size-8 rounded-full border bg-background">
                                <IconPlayerPlay className="size-3.5 sm:size-4 text-muted-foreground" />
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {lecture.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Lecture {i + 1}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-16 space-y-6">
            <Card>
              <CardContent className="p-5 sm:p-6 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm sm:text-base">
                    {course.courseCode}
                  </h4>

                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <School className="size-4 text-primary" />
                      <div>
                        <p className="font-medium">Faculty</p>
                        <p className="text-muted-foreground">
                          {course.faculty}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <BookOpen className="size-4 text-primary" />
                      <div>
                        <p className="font-medium">Department</p>
                        <p className="text-muted-foreground">
                          {course.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <IconChartBar className="size-4 text-primary" />
                      <div>
                        <p className="font-medium">Level</p>
                        <p className="text-muted-foreground">
                          {levelLabels[course.level]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">This course includes:</h4>

                  {[
                    "Full lifetime access",
                    "Access on mobile and desktop",
                    "Certificate of Completion",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                {isEnrolled ? (
                  <Button variant="outline" disabled className="w-full items-center">
                    Registered <CheckIcon className="size-4"/>
                  </Button>
                ) :(
                  <div>

                  </div>
                )
              }
                <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
