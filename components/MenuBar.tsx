import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Toggle } from "./ui/toggle";
import { Bold } from "lucide-react";

interface iAppProps {
  editor: Editor | null;
}

export function MenuBar({ editor }: iAppProps) {
  if (!editor) return null;

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const isBoldActive = editor.isActive("bold");

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 border rounded-md p-1 w-fit">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={isBoldActive}
              onPressedChange={toggleBold}
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </Toggle>
          </TooltipTrigger>

          <TooltipContent>
            <p>Bold (Ctrl + B)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}