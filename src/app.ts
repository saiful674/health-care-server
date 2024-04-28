import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response, urlencoded } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the HealthCare Server.");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
