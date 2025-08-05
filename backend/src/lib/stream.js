import {StreamChat} from "stream-chat";
import "dotenv/config";


const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}


const streamClient =  StreamChat.getInstance(apiKey,apiSecret); // With this streamClient we can communicate with the stream application.

export const upsertStreamUser = async (userData)=>{ // add and update.
    
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.log("Error upserting Stream user:",error);
    }
};

// used for chat and video call services.
export const generateStreamToken = (userId) => {
    try{
    // ensure userId is a string
    const userIdStr = userId.toString();
    return  streamClient.createToken(userIdStr);

    }catch(error){
      console.error("Error generating stream token",error);

    } 
};
