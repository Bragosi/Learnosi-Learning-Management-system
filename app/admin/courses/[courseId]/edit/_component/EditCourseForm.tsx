"use client";

import { Button } from "@/components/ui/button";
import {
  courseCategory,
  courseLevel,
  courseSchema,
  courseStatus,
  levelLabels,
} from "@/lib/zodSchema";
import { Loader, PlusIcon, SparkleIcon } from "lucide-react";
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
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditCourse } from "../action";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { CourseSchemaType } from "../../../create/action";

interface iAppProps{
    value : AdminCourseType
}

export function EditCourseForm({value} : iAppProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      title: value.title,
      description: value.description,
      fileKey: value.fileKey,
      price: value.price,
      duration: value.duration,
      level: value.level,
      category: value.category as CourseSchemaType["category"],
      smallDescription: value.smallDescription,
      slug: value.slug,
      status: value.status,
    },
  });
  function onSubmit(data: z.infer<typeof courseSchema>) {
    startTransition(async () => {
      // FIX: pass 'data' instead of 'values'
      const { data: result, error } = await tryCatch(EditCourse(data, value.id));

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

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              const titleValue = form.getValues("title");
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
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Small Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Small Description"
                    className="min-h-30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
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
                  <Uploader onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <div className="w-full">
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseCategory.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Duration"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

        {/* FIX: Removed <p> from inside the button for valid HTML */}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center">
              <Loader className="animate-spin size-4 mr-2" />
              Creating Course...
            </span>
          ) : (
            <span className="flex items-center">
              Update Course <PlusIcon className="ml-2 size-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
