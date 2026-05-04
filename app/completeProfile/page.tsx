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
  CardFooter,
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
import { CreateProfile } from "./action";
import { toast } from "sonner";
import { Loader, PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      bio: "",
      phone: "",
      faculty: "School of Computing",
      department: "",
      level: "LEVEL_100",
      avatarKey: "",
      matricNumber: "",
    },
  });

  const selectedFaculty = form.watch("faculty");

  useEffect(() => {
    form.setValue("department", "");
  }, [selectedFaculty]);

  const faculties = Object.keys(facultyDepartments) as Faculty[];
  const departments = facultyDepartments[selectedFaculty] || [];

  function onSubmit(data: z.infer<typeof ProfileSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateProfile(data));

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
    <div className="min-h-screen mt-6 flex items-center justify-center bg-muted/40 px-4 py-10">
      <Card className=" max-w-xl shadow-xl border">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image src={Logo} width={50} height={50} alt="logo" />
          </div>

          <CardTitle className="text-2xl font-bold">
            Complete Your Profile
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Fill in your details to unlock full access to Learnosi
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center gap-3">
                <FormField
                  control={form.control}
                  name="avatarKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full mt-1">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input className="mt-1" placeholder="John" {...field} />
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
                        <Input className="mt-1" placeholder="Doe" {...field} />
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
                        <Input
                          className="mt-1"
                          placeholder="Optional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* BIO + PHONE */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 mt-1 w-full"
                        placeholder="Tell us about yourself"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="mt-1"
                        placeholder="080xxxxxxxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* SCHOOL INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                        <Input
                          className="mt-1"
                          placeholder="Your matric number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SUBMIT */}
              <div className="pt-4 w-full">
                <Button className="w-full" type="submit" disabled={pending}>
                  {pending ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin size-4 mr-2" />
                      Creating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create Profile <PlusIcon className="ml-2 size-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-6">
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
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
