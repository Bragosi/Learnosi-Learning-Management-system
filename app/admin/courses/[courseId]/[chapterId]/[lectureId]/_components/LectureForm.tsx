"use client";

import { AdminLectureType } from "@/app/data/admin/admin-get-lecture";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { LectureSchema, LectureSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { updateLecture } from "../action";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface iAppProps {
  data: AdminLectureType;
  chapterId: string;
  courseId: string;
}

export function LectureForm({ chapterId, data, courseId }: iAppProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LectureSchemaType>({
    resolver: zodResolver(LectureSchema),
    mode: "onChange",
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      videoKey: data.videoKey ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      pdfKey: data.pdfKey ?? undefined,
    },
  });

  function onSubmit(values: LectureSchemaType) {
    startTransition(async () => {
      // FIX: pass 'data' instead of 'values'
      const { data: result, error } = await tryCatch(
        updateLecture(values, data.id),
      );

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        router.push(`/admin/courses/${courseId}/edit`);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div>
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "mb-4")}
        href={`/admin/courses/${courseId}/edit`}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lecture Configuration</CardTitle>
          <CardDescription>
            Configure the Video and description for this lecture
          </CardDescription>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lecture Name</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-1"
                          placeholder="Lecture xyz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div className="mt-1">
                          <RichTextEditor field={field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnailKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="mt-1">
                          <Uploader
                            fileTypeAccepted="image"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video File</FormLabel>
                      <FormControl>
                        <div className="mt-1">
                          <Uploader
                            fileTypeAccepted="video"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pdfKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF File (Optional)</FormLabel>
                      <FormControl>
                        <div className="mt-1">
                          <Uploader
                            fileTypeAccepted="pdf"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <div className="flex gap-2 items-center">
                      <Loader className="animate-spin size-4" />
                      Updating...
                    </div>
                  ) : (
                    <div>Update Lecture</div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
