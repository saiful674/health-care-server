import cors from "cors";
import express, { Request, Response, urlencoded } from "express";
import { adminRouter } from "./app/modules/admin/admin.routes";
import { userRouter } from "./app/modules/user/user.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the HealthCare Server.");
});

export default app;
