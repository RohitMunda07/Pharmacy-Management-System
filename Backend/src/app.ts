import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { corsOptions } from "./config/cors.config";
import { apiLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { env } from "./env";

const data = {
    message: 'Hello, this is a JSON response!',
    status: 'success',
    timestamp: new Date()
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);


// app.get("/", (req, res) => {
//     res.send("Alright!!").json({
//         status: 200,
//         message: "Every thing is fine",
//         data
//     })
// })

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
