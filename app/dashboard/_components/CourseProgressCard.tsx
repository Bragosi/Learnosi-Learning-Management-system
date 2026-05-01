"use client"
import { EnrolledCourseType } from "@/app/data/user/GetEnrolledCourses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/useContructUrl";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { levelLabels } from "@/lib/zodSchema";
import { BookOpen, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCourseType;
}

export default function CourseProgressCard({ data }: iAppProps) {
const { totalLecture, completedLecture, progressPercentage } =
  useCourseProgress({ courseData: data });
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">
        {levelLabels[data.level]}
      </Badge>

      <Image
        width={600}
        height={400}
        src={thumbnailUrl}
        alt="Thumbnail Image"
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.courseCode}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">
          {data.courseTitle}
        </p>
  <div className="mt-4 flex items-center gap-x-5 ">
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.faculty}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <BookOpen className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.department}</p>
          </div>
        </div>
        <div className="space-y-4 mt-5">
            <div className=" flex justify-between mb-1 text-sm ">
                <p>Progress:</p>
                <p className="font-medium">{progressPercentage}%</p>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
            <p className="text-xs text-muted-foreground mti1">{completedLecture} of {totalLecture} Lectures completed</p>
        </div>
        {/** */}
        <Link
          href={`/dashboard/${data.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      {/* Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Image */}
      <Skeleton className="w-full aspect-video rounded-t-xl" />

      <CardContent className="p-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Description */}
        <div className="mt-1 space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Meta (Faculty + Department) */}
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
