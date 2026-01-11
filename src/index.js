import express from "express"
import dotenv from "dotenv"
import { authroute } from "./routes/authroute.js"
import { msgroute } from "./routes/messageroute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
// Load environment variables first
dotenv.config()


const port = process.env.PORT || 3000

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import { metricsMiddleware, metricsRoute } from "./lib/metrics.js";
app.use(metricsMiddleware);
app.get("/metrics", metricsRoute);

app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT"]
}));


app.use("/api/auth", authroute)
app.use("/api/messages", msgroute)


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("CORS Origin Configured for: ALL");
})
