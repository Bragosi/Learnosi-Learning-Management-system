import { RequireUser } from "@/app/data/user/requireUser";

export async function GetMyProfile(){
try {
        const user = RequireUser()
    if(!user){
        
    }

} catch {
    
}
}