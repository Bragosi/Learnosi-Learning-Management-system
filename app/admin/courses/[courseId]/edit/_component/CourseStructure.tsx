"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminGetSingleCourseType } from "@/app/data/admin/admingetSingleCourse";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reOrderChapters, reOrderLessons } from "../action";

interface iAppProps {
  data: AdminGetSingleCourseType;
}

interface sortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lecture";
    chapterId?: string;
  };
}

export default function CourseStructure({ data }: iAppProps) {
  // Mapping the new Prisma structure (chapters -> lectures) to local state
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lectures: chapter.lectures.map((lecture) => ({
        id: lecture.id,
        title: lecture.title,
        order: lecture.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);

  function SortableItem({ children, id, className, data }: sortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : " ")}
      >
        {children(listeners)}
      </div>
    );
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter,
      ),
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeType = active.data.current?.type as "chapter" | "lecture";
    const overType = over.data.current?.type as "chapter" | "lecture";
    const previousItems = [...items];

    // --- CHAPTER REORDERING ---
    if (activeType === "chapter") {
      const targetChapterId =
        overType === "chapter" ? overId : over.data.current?.chapterId;

      if (!targetChapterId) return;

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reOrderedLocalChapter = arrayMove(items, oldIndex, newIndex);
        const updatedChapters = reOrderedLocalChapter.map((chapter, index) => ({
          ...chapter,
          order: index + 1,
        }));

        setItems(updatedChapters);

        const payload = updatedChapters.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        toast.promise(reOrderChapters(data.id, payload), {
          loading: "Updating chapter order...",
          success: "Chapters reordered!",
          error: (err) => {
            setItems(previousItems);
            return err?.message || "Failed to reorder chapters";
          },
        });
      }
    }

    // --- LECTURE REORDERING ---
    else if (activeType === "lecture") {
      const activeChapterId = active.data.current?.chapterId;
      const targetChapterId =
        overType === "lecture" ? over.data.current?.chapterId : overId;

      if (activeChapterId && activeChapterId === targetChapterId) {
        const chapterIndex = items.findIndex((c) => c.id === activeChapterId);

        if (chapterIndex !== -1) {
          const chapter = items[chapterIndex];
          const oldIndex = chapter.lectures.findIndex((l) => l.id === activeId);
          const newIndex = chapter.lectures.findIndex((l) => l.id === overId);

          const updatedLectures = arrayMove(
            chapter.lectures,
            oldIndex,
            newIndex,
          ).map((lecture, index) => ({
            ...lecture,
            order: index + 1,
          }));

          const updatedItems = [...items];
          updatedItems[chapterIndex] = {
            ...chapter,
            lectures: updatedLectures,
          };
          setItems(updatedItems);

          const payload = updatedLectures.map((lecture) => ({
            id: lecture.id,
            position: lecture.order,
          }));

          toast.promise(reOrderLessons(activeChapterId, payload, data.id), {
            loading: "Saving lecture order...",
            success: "Lectures successfully reordered",
            error: (err) => {
              setItems(previousItems);
              return err?.message || "Failed to reorder lectures";
            },
          });
        }
      } else {
        toast.error("Moving lectures between chapters is not supported.");
      }
    }
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Course Structure</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                id={item.id}
                data={{ type: "chapter" }}
                key={item.id}
                className="mb-4"
              >
                {(listeners) => (
                  <Card className="overflow-hidden">
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost">
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="font-medium pl-2">{item.title}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-2 space-y-1">
                          <SortableContext
                            items={item.lectures.map((l) => l.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lectures.map((lecture) => (
                              <SortableItem
                                key={lecture.id}
                                id={lecture.id}
                                data={{ type: "lecture", chapterId: item.id }}
                              >
                                {(lectureListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md group">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...lectureListeners}
                                        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4 text-muted-foreground" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lecture.id}`}
                                        className="text-sm hover:underline"
                                      >
                                        {lecture.title}
                                      </Link>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          <div className="mt-2 px-2 pb-2">
                            <Button
                              className="w-full text-xs h-8"
                              variant="outline"
                            >
                              + Add Lecture
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
