import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/useContructUrl";
import { levelLabels } from "@/lib/zodSchema";
import {
  ArrowRight,
  Building,
  Eye,
  MoreVerticalIcon,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCoursecard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-muted py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.id}`}>
                <Eye className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.id}`}>
                <Trash2 className="size-4 mr-2 text-destructive" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={data.courseTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors"
        >
          {data.courseCode}
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.courseTitle}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Building className="size-8 p-1.5 rounded-md text-primary bg-primary/10" />
            <span className="text-sm text-muted-foreground">
              {data.faculty} hours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TimerIcon className="size-8 p-1.5 rounded-md text-primary bg-primary/10" />
            <span className="text-sm text-muted-foreground">
              {data.department} hours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <School className="size-8 p-1.5 rounded-md text-primary bg-primary/10" />
            <span className="text-sm text-muted-foreground capitalize">
              {levelLabels[data.level]}
            </span>
          </div>
        </div>

        <Link
          className={buttonVariants({
            className: "w-full mt-4",
          })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
