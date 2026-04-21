"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "../MenuBar";
import { useEffect, useState } from "react";
import TextAlign from "@tiptap/extension-text-align"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RichTextEditor({field}: {field : any}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, 
      TextAlign.configure({
        types:["heading", "paragraph"]
      })
    ],
    editorProps:{
      attributes:{
        class : 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none ', 
      }
    },
    onUpdate :({editor})=>{
      field.onChange(JSON.stringify(editor.getJSON()))
    }, 
    content: field.value ? JSON.parse(field.value) : "<p>Hello world</p>",
    immediatelyRender: false,
  });

  if (!mounted || !editor) return null;

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden
    dark:bg-input/30 ">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
</div>
  );
}