import cors from "cors";
import express, { Request, Response, urlencoded } from "express";
import router from "./app/routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the HealthCare Server.");
});

export default app;
