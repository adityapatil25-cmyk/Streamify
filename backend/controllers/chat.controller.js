import User from "../src/models/User.js";
import { generateStreamToken } from "../src/lib/stream.js";
export async function getStreamToken(req,res){
    try{
        const token = generateStreamToken(req.user.id);
        res.status(200).json({token});
    }catch(error){
        console.log("Error in getStreamToken controller:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
// so this generation of the stream token is necessary for visiting and performing the chat and video calls.