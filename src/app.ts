import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the HealthCare Server.");
});

export default app;
