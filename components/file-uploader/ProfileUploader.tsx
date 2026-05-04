"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/useContructUrl";

import {
  ProfileEmptyState,
  ProfileErrorState,
  ProfileUploadedState,
  ProfileUploadingState,
} from "./ProfileRenderState";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

interface State {
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  objectUrl?: string;
  error: boolean;
  isDeleting: boolean;
}

export function ProfileUploader({ value, onChange }: Props) {
  const fileUrl = useConstructUrl(value || "");

  const [state, setState] = useState<State>({
    file: null,
    uploading: false,
    progress: 0,
    key: value,
    objectUrl: value ? fileUrl : undefined,
    error: false,
    isDeleting: false,
  });

  // ✅ FIX: sync external value → local preview
  useEffect(() => {
    if (value && fileUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => ({
        ...prev,
        objectUrl: fileUrl,
        key: value,
      }));
    }
  }, [value, fileUrl]);

  const uploadFile = useCallback(
    async (file: File) => {
      setState((prev) => ({ ...prev, uploading: true, progress: 0 }));

      try {
        const res = await fetch("/api/s3/upload", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            fileType: "image",
          }),
        });

        if (!res.ok) throw new Error();

        const { presignedUrl, Key } = await res.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setState((prev) => ({
                ...prev,
                progress: Math.round((e.loaded / e.total) * 100),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              onChange?.(Key); // ← triggers useEffect sync

              setState((prev) => ({
                ...prev,
                uploading: false,
                progress: 100,
              }));

              toast.success("Profile uploaded");
              resolve();
            } else reject(new Error());
          };

          xhr.onerror = () => reject(new Error());

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        toast.error("Upload failed");
        setState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
        }));
      }
    },
    [onChange],
  );

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const preview = URL.createObjectURL(file);

      setState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: preview,
        key: undefined,
        error: false,
        isDeleting: false,
      });

      uploadFile(file);
    },
    [uploadFile],
  );

  async function handleRemoveFile() {
    if (!state.key) return;

    setState((prev) => ({ ...prev, isDeleting: true }));

    await fetch("/api/s3/delete", {
      method: "DELETE",
      body: JSON.stringify({ key: state.key }),
    });

    onChange?.("");

    setState({
      file: null,
      uploading: false,
      progress: 0,
      objectUrl: undefined,
      key: undefined,
      error: false,
      isDeleting: false,
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => toast.error("Max 10MB image"),
    disabled: state.uploading,
  });

  function render() {
    if (state.uploading)
      return <ProfileUploadingState progress={state.progress} />;

    if (state.error) return <ProfileErrorState />;

    if (state.objectUrl)
      return (
        <ProfileUploadedState
          previewUrl={state.objectUrl}
          isDeleting={state.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );

    return <ProfileEmptyState isDragActive={isDragActive} />;
  }

return (
  <div className="flex flex-col items-center gap-3">
<div
  {...getRootProps()}
  className={cn(
    "relative aspect-square w-32 sm:w-36 md:w-40 rounded-full overflow-hidden cursor-pointer group shrink-0",
    "border-2 border-dashed transition-all duration-200 bg-muted",
    isDragActive
      ? "border-primary ring-2 ring-primary/30"
      : "border-muted-foreground/30 hover:border-primary"
  )}
>
      <input {...getInputProps()} />
      {render()}
    </div>
  </div>
);
}