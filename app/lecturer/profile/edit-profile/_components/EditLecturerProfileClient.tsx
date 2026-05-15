"use client";

import { GetLecturerProfileType } from "@/app/data/lecturer/GetLecturerProfile";
import { Faculty, facultyDepartments } from "@/lib/facultyDepartments";
import {
  lecturerPosts,
  LecturerProfileSchema,
} from "@/lib/zodSchema";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Logo from "@/public/Learnosi-Logo.png";

import { ProfileUploader } from "@/components/file-uploader/ProfileUploader";

import { Loader2 } from "lucide-react";
import { tryCatch } from "@/hooks/try-catch";
import { EditLecturerProfile } from "./action";
import { toast } from "sonner";

interface iAppProps {
  data: GetLecturerProfileType;
}

export default function EditLecturerProfileClient({
  data,
}: iAppProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const profileData = data.lecturerProfile;

  const faculties = Object.keys(facultyDepartments) as Faculty[];

  const form = useForm<z.infer<typeof LecturerProfileSchema>>({
    resolver: zodResolver(LecturerProfileSchema),
    defaultValues: {
      firstName: profileData?.firstName ?? "",
      lastName: profileData?.lastName ?? "",
      otherName: profileData?.otherName ?? "",
      bio: profileData?.bio ?? "",
      faculty: (profileData?.faculty as Faculty) ?? faculties[0],
      department: profileData?.department ?? "",
      profilePicture: profileData?.profilePicture ?? "",
      employeeId: profileData?.employeeId ?? "",
      email: profileData?.email ?? "",
      officeLocation: profileData?.officeLocation ?? "",
      title: profileData?.title,
    },
  });

  const selectedFaculty = form.watch("faculty");

  const departments = facultyDepartments[selectedFaculty] || [];

  useEffect(() => {
    form.setValue("department", "");
  }, [selectedFaculty]);

  function onSubmit(data: z.infer<typeof LecturerProfileSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(EditLecturerProfile(data));

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/lecturer/profile");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="min-h-screen bg-muted/40 px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex justify-center">
      <Card className="w-full max-w-4xl shadow-lg sm:shadow-xl border rounded-2xl">
        <CardHeader className="space-y-4 text-center px-4 sm:px-8 pt-6 sm:pt-8">
          <div className="flex justify-center">
            <Image
              src={Logo}
              width={48}
              height={48}
              alt="logo"
              className="sm:w-14 sm:h-14"
            />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Lecturer Profile
          </CardTitle>

          <CardDescription className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Update your lecturer information, academic details,
            and profile settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center gap-3">
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full max-w-45 sm:max-w-50">
                          <ProfileUploader
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-muted-foreground">
                  Upload a clear profile picture
                </p>
              </div>

              {/* NAMES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>

                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>

                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Name</FormLabel>

                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* BIO */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>

                    <FormControl>
                      <Input
                        className="h-12"
                        placeholder="Tell students about your academic background..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMPLOYEE ID */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OFFICE */}
              <FormField
                control={form.control}
                name="officeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Location</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SCHOOL INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Faculty" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {faculties.map((faculty) => (
                            <SelectItem
                              key={faculty}
                              value={faculty}
                            >
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Title" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {Object.entries(lecturerPosts).map(
                            ([value, label]) => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full sm:w-auto min-w-55"
              >
                {pending ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating Profile...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}