"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Shield,
  UserCheck,
  BookOpen,
  Users,
  Tv2Icon,
} from "lucide-react";

export function SectionCards({
  stats,
}: {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalLecturers: number;
    totalAdmins: number;
    totalCourses: number;
    totalLectures: number;
  };
}) {
  return (
    <div
      className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  2xl:grid-cols-6 
  gap-4 
  md:gap-6
"
    >
      {/* Total Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="size-4" />
              All Accounts
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Total number of registered users on the platform
        </CardFooter>
      </Card>

      {/* Students */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalStudents.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <GraduationCap className="size-4" />
              Learners
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm h-full w-full text-muted-foreground">
          Users enrolled as students across all courses
        </CardFooter>
      </Card>

      {/* Lecturers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lecturers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalLecturers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <UserCheck className="size-4" />
              Instructors
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm h-full w-full text-muted-foreground">
          Verified lecturers managing and teaching courses
        </CardFooter>
      </Card>

      {/* Admins */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Admins</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalAdmins.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="size-4" />
              System Control
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm h-full w-full text-muted-foreground">
          Administrators with full platform access
        </CardFooter>
      </Card>
      {/** Total courses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalCourses.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="size-4" />
              All Courses
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm h-full w-full text-muted-foreground">
          Total number of Published courses on the platform
        </CardFooter>
      </Card>

      {/** Total Lectures */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lectures</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalLectures.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tv2Icon className="size-4" />
              All Lectures
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm h-full w-full text-muted-foreground">
          Total number of learning content available
        </CardFooter>
      </Card>
    </div>
  );
}
