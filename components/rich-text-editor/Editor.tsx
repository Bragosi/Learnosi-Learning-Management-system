/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "../MenuBar";
import { useEffect, useState } from "react";
import TextAlign from "@tiptap/extension-text-align";


export function RichTextEditor({ field }: { field: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    content: "<p></p>", // ✅ NEVER bind field.value here
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      field.onChange(JSON.stringify(json)); // ✅ keep this
    },
    immediatelyRender: false,
  });

  // ✅ Sync external value → editor (VERY IMPORTANT)
  useEffect(() => {
    if (editor && field.value) {
      try {
        const parsed = JSON.parse(field.value);
        editor.commands.setContent(parsed);
      } catch {
        editor.commands.setContent("<p></p>");
      }
    }
  }, [editor, field.value]);

  if (!mounted || !editor) return null;

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}