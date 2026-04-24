"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseLevel,
  courseSchema,
  courseStatus,
  levelLabels,
} from "@/lib/zodSchema";
import { ArrowLeft, Loader, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useEffect, useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Faculty, facultyDepartments } from "@/lib/facultyDepartments";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      courseCode: "",
      description: "",
      fileKey: "",
      level: "LEVEL_100",
      faculty: "School of Computing",
      courseTitle: "",
      slug: "",
      status: "DRAFT",
      department: "",
    },
  });

  function onSubmit(data: z.infer<typeof courseSchema>) {
    startTransition(async () => {
      // FIX: pass 'data' instead of 'values'
      const { data: result, error } = await tryCatch(CreateCourse(data));

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }
  const selectedFaculty = form.watch("faculty");

  useEffect(() => {
    form.setValue("department", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedFaculty]);
  const faculties = Object.keys(facultyDepartments) as Faculty[];
  const departments = facultyDepartments[selectedFaculty] || [];
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Course</h1>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/** Course Code */}
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Course Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Course Title */}
              <FormField
                control={form.control}
                name="courseTitle"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g Software Engineering"
                          className="min-h-30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              {/** Generate Slug */}
              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <div className="w-full">
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="Slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const titleValue = form.getValues("courseTitle");
                    // Good practice: strict mode handles special characters properly
                    const slug = slugify(titleValue, {
                      lower: true,
                      strict: true,
                    });
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Generate Slug <SparkleIcon className="ml-1" size={16} />
                </Button>
              </div>

              {/** Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <Uploader
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <div className="w-full">
                      <FormItem>
                        <FormLabel>Faculty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <div className="w-full">
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedFaculty}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <div className="w-full">
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevel.map((level) => (
                              <SelectItem key={level} value={level}>
                                {levelLabels[level]}{" "}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <div className="w-full">
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              {/* FIX: Removed <p> from inside the button for valid HTML */}
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin size-4 mr-2" />
                    Creating Course...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Course <PlusIcon className="ml-2 size-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
