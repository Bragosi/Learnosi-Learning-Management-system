"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { lecturerPosts, LecturerRequestSchema } from "@/lib/zodSchema";
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
import { CreateLecturerRequest } from "./action";
import { toast } from "sonner";
import { Loader, PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LecturerPost } from "@prisma/client";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

export default function LecturerRequest() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LecturerRequestSchema>>({
    resolver: zodResolver(LecturerRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      faculty: "School of Computing",
      department: "",
      email: "",
      profilePicture: "",
      employeeId: "",
      post: "LECTURER",
      phone: "",
      professionalSummary: "",
    },
  });

  const selectedFaculty = form.watch("faculty");

  useEffect(() => {
    form.setValue("department", "");
  }, [selectedFaculty]);

  const faculties = Object.keys(facultyDepartments) as Faculty[];
  const departments = facultyDepartments[selectedFaculty] || [];

  function onSubmit(data: z.infer<typeof LecturerRequestSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        CreateLecturerRequest(data),
      );

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/");
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
            Submit your Lecturer Badge Request
          </CardTitle>

          <CardDescription className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Fill in your details be able to teach to Learnosi .
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

              <FormField
                control={form.control}
                name="professionalSummary"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Professional Summary</FormLabel>
                      <FormControl>
                        <div className="w-full mt-2">
                          <RichTextEditor field={field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
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
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
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

                {/* post */}
                <FormField
                  control={form.control}
                  name="post"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LecturerPost).map((post) => (
                            <SelectItem key={post} value={post}>
                              {lecturerPosts[post]}
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
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your employee ID" {...field} />
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
                      Submitting Request...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Submit Request <PlusIcon className="ml-2 size-4" />
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
              href="/"
            >
              Not a Student? Complete your profile instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
