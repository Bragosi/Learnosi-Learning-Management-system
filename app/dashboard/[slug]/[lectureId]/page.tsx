import { GetLectureContent } from "@/app/data/PublicCourse/GetLectureContent"
import { CourseContent } from "./_components/CourseContent"

type Params = Promise<{lectureId : string}>

export default async function LectureContentPage({params} : {params : Params}){
    const {lectureId} = await params
        const data = await GetLectureContent(lectureId)
    return(
<CourseContent data={data}/>
    )
}