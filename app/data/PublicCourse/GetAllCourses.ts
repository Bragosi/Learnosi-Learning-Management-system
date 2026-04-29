import { prisma } from "@/lib/prisma";
import "server-only"

export async function GetAllCourses(){
    const data = await prisma.course.findMany({
        where : {
            status : 'PUBLISHED'
        },
        orderBy : {
            createdAt : 'desc'
        },
        select : {
            courseTitle : true, 
            courseCode : true,
            slug : true,
            fileKey : true,
            faculty : true,
            department : true, 
            level : true,
            description : true,
            id : true,

        }
    })
    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof GetAllCourses>>[0];