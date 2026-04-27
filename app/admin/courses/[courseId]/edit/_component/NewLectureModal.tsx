import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LectureSchema } from "@/lib/zodSchema";
import { Loader, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { createLecture } from "../action";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";

export function NewLectureModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof LectureSchema>>({
    resolver: zodResolver(LectureSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      courseId,
      chapterId,
    },
  });

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) form.reset();
  }

  async function onSubmit(values: z.infer<typeof LectureSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLecture(values));
      if (error) {
        toast.error("An unexpected Error occured");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-center gap-1">
          <Plus className="size-4 mr-2" />
          New Lecture
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new Lecture</DialogTitle>
          <DialogDescription>
            Arrange your Lectures in the correct order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecture name</FormLabel>
                  <Input placeholder="e.g. Lecture 1 " {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={pending} className="">
                {pending ? (
                  <div className="flex gap-2 items-center">
                    <Loader className="animate-spin size-4" />
                    Creating Lecture
                  </div>
                ) : (
                  <div>Create Lecture</div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
