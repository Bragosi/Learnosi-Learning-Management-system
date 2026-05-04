"use client";

import { Loader2, Camera, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ProfileEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* subtle hover / drag overlay */}
      <div
        className={cn(
          "absolute inset-0 transition",
          isDragActive && "bg-primary/10 w-6xl h-6xl rounded-full animate-ping"
        )}
      />

      <div className="z-10 flex flex-col items-center justify-center gap-1">
        <Camera className="w-7 h-7 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">
          Upload
        </span>
      </div>
    </div>
  );
}

export function ProfileUploadingState({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <span className="text-[10px] text-muted-foreground">
        {progress}%
      </span>
    </div>
  );
}

export function ProfileErrorState() {
  return (
    <div className="w-full h-full flex items-center justify-center text-xs text-destructive">
      Failed
    </div>
  );
}

export function ProfileUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
}) {
  return (
    <div className="relative w-full h-full">
      {/* ✅ ALWAYS fill container */}
      <Image
        src={previewUrl}
        alt="Profile"
        className="w-full h-full object-cover"
        width={20}
        height={20}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
        >
          <Camera className="w-4 h-4 text-black" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={handleRemoveFile}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}