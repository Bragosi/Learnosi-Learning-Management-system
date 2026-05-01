"use client";

import { LectureContentType } from "@/app/data/PublicCourse/GetLectureContent";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/useContructUrl";
import { BookIcon, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MarkLectureComplete } from "../action";
import { useTransition } from "react";

interface iAppProps {
  data: LectureContentType;
}

function PdfButton({ pdfKey }: { pdfKey: string | null }) {
  const pdfUrl = useConstructUrl(pdfKey ?? "");

  if (!pdfKey) {
    return (
      <Button variant="outline" disabled>
        <BookIcon className="size-4 mr-2 text-primary" />
        NO PDF Available
      </Button>
    );
  }
  return (
    <div className="space-y-3">
      {/* Download button */}
      <div className="flex justify-end">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">View PDF</Button>
        </a>
      </div>
    </div>
  );
}

function VideoPlayer({
  thumbnailkey,
  videoKey,
}: {
  thumbnailkey: string;
  videoKey: string;
}) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailkey);

  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This Lecture does not have a video yet
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
      <video
        src={videoUrl}
        poster={thumbnailUrl || undefined}
        controls
        className="w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLectureComplete(data.id, data.chapter.course.slug),
      );

      if (error) {
        toast.error("An Unexpected Error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailkey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b justify-between flex gap-4">
        {data.lectureProgress.length > 0 ? (
          <Button
            disabled
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-600 hover:text-green-600"
          >
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <p>Marking...</p>
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="size-4 mr-2 text-green-500" />
                <p>Mark as complete</p>
              </div>
            )}
          </Button>
        )}

        <PdfButton pdfKey={data.pdfKey} />
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
      <div>
      </div>
    </div>
  );
}
