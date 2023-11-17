import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import bodyParser from "body-parser";
import path from "path";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import reportRouter from "./routes/reportRouter.js";
import adminRouter from "./routes/adminRouter.js";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import initializeSocketServer from "./socket/index.js";

import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/** middlewears */
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5050", "http://buzzgram.online", "https://buzzgram.online"],
    })
);

app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.disable("x-powered-by"); //less hackers know about our stack

/** HTTP GET request */
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// app.get("/", (req, res) => {
//     res.status(200).json("HOME Page");
// });

const apiRouter = express.Router();

// Define your API routes
apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/report", reportRouter);
apiRouter.use("/message", messageRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/notification", notificationRouter);
apiRouter.use("/admin", adminRouter);

// Set the common prefix for all API routes
app.use("/api", apiRouter);

/** start server when only we have a valid connection*/
connect()
    .then(() => {
        try {
            app.listen(process.env.PORT, () => {
                console.log(`Server connected to port: ${process.env.PORT}`);
                initializeSocketServer();
            });
        } catch (error) {
            console.log("Cannot connect to the server");
        }
    })
    .catch((error) => {
        console.log("Inavlid database connection");
    });
