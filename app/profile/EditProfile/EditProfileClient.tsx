"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseLevel, levelLabels, ProfileSchema } from "@/lib/zodSchema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Faculty, facultyDepartments } from "@/lib/facultyDepartments";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/Learnosi Logo.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useTransition } from "react";
import { ProfileUploader } from "@/components/file-uploader/ProfileUploader";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader, PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GetMyProfileType } from "@/app/data/user/GetMyProfile";
import { EditProfile } from "./_components/action";

interface iAppProps {
  data: GetMyProfileType;
}

export default function EditProfilePage({ data }: iAppProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const profileData = data.profile;

  const faculties = Object.keys(facultyDepartments) as Faculty[];

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: profileData?.firstName ?? "",
      lastName: profileData?.lastName ?? "",
      otherName: profileData?.otherName ?? "",
      bio: profileData?.bio ?? "",
      phone: profileData?.phone ?? "",
      faculty: (profileData?.faculty as Faculty) ?? faculties[0],
      department: profileData?.department ?? "",
      level: profileData?.level ?? "LEVEL_100",
      avatarKey: profileData?.avatarKey ?? "",
      matricNumber: profileData?.matricNumber ?? "",
    },
  });
  const selectedFaculty = form.watch("faculty");
  const departments = facultyDepartments[selectedFaculty] || [];
  useEffect(() => {
    form.setValue("department", "");
  }, [selectedFaculty]);

  function onSubmit(data: z.infer<typeof ProfileSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(EditProfile(data));

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/profile");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="min-h-screen bg-muted/40 px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex justify-center">
      <Card className="w-full max-w-4xl shadow-lg sm:shadow-xl border rounded-2xl">
        {/* HEADER */}
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

          <CardTitle className="text-xl sm:text-2xl font-bold">
            Edit Your Profile
          </CardTitle>

          <CardDescription className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Update your profile to unlock personalized features and content
            tailored to your experience.
          </CardDescription>
        </CardHeader>

        {/* CONTENT */}
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
                  name="avatarKey"
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
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        placeholder="Tell us about yourself"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="080xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SCHOOL INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Faculty */}
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {faculties.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedFaculty}
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

                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevel.map((level) => (
                            <SelectItem key={level} value={level}>
                              {levelLabels[level]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Matric */}
                <FormField
                  control={form.control}
                  name="matricNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matric Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your matric number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SUBMIT */}
              <div className="pt-2">
                <Button
                  className="w-full h-11 text-sm sm:text-base"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin size-4 mr-2" />
                      Updating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Update Profile <PlusIcon className="ml-2 size-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* SECONDARY ACTION */}
          <div className="mt-6">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-11 text-sm sm:text-base",
              )}
              href="/profile/request-lecturer-badge"
            >
              Not a student? Request Lecturer Badge
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
