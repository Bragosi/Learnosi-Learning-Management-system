"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "../MenuBar";
import { useEffect, useState } from "react";

export function RichTextEditor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  });

  if (!mounted || !editor) return null;

  return (
    <div className="border rounded-md p-2">
      <MenuBar editor={editor} />

<div className="mt-2 min-h-50 p-2 focus-within:ring-0 focus:outline-none">
  <EditorContent
  editor={editor}
  className="outline-none focus:outline-none"
/>
</div>
    </div>
  );
}