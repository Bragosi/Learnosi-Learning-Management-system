import { adminGetLecture } from "@/app/data/admin/admin-get-lecture";
import { LectureForm } from "./_components/LectureForm";

type Params = Promise<{
    courseId : string;
    chapterId : string;
    lectureId : string;
}>;

export default async function LectureIdPage ({params} : {params : Params}){
    const { chapterId, courseId, lectureId} = await params
    const lecture = await adminGetLecture(lectureId)
    
    return(
        <LectureForm data={lecture} chapterId={chapterId} courseId={courseId} / >
    )

}