import express from "express";
import dotenv from "dotenv"; // for .env file
dotenv.config(); // needed to import for reading the file content.


import authRoutes  from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import chatRoutes from "../routes/chat.routes.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
const PORT = process.env.PORT;
const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials: true , //allow frontend to send cookies
    })
)
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "../frontend/chatapp/dist")));
}

app.get("*",(req,res)=>{
     res.sendFile(path.join(__dirname, "../frontend/chatapp","dist","index.html"));
})

app.listen(PORT, ()=>{
    console.log(`Server is listning on port ${PORT}`);
    connectDB();
})


/*
Why You Create Users in Both:
1. Your own backend database (MongoDB)
2. Stream Chat system (Stream servers)
🔁 Reason: Two different systems with different responsibilities
System	Purpose
Your Backend (e.g. MongoDB)	Stores user data like email, password, preferences, profile info
Stream Chat	Manages real-time chat: messages, channels, unread counts, typing, etc

🔍 Example Scenario
You are building a chat app like WhatsApp or Discord:

1. In Your Backend
You store:

Email, password, profile image

Friend list

Settings, preferences

Account verification, authentication

Secure login (JWT, sessions)

2. In Stream
You store:

Chat-specific data like:

Messages

Channels

Last read time

Online status

Unread counts

Mutes / blocks

🔒 But Stream doesn't know or care about login credentials — that’s your job.

✅ So Why Create User in Stream?
To enable chat features, Stream needs to know:

Who the user is (userId)

Their display name, image (optional)

Permissions (like moderator, admin)

Only then can they:

Add the user to chat channels

Let them send/receive messages

Show their name/image in the chat UI

🧠 Summary
Task	Backend DB	Stream
Auth & Login	✅	❌
Email / Password	✅	❌
User image / name for chat UI	✅/✅	✅
Send / Receive chat messages	❌	✅
Real-time typing / presence	❌	✅

✅ When you "Onboard" a user in backend
You typically:

Save them in your MongoDB (if not already there)

Register them in Stream Chat using upsertUser(...) so they can participate in chats

Let me know if you want help structuring your onboarding controller to do both cleanly (create user in DB + create user in Stream).







You said:
so it is basically for the understanding of the stream like who the user is 
right ????


ChatGPT said:
Exactly — you nailed it ✅

*/