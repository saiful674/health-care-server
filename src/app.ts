import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response, urlencoded } from "express";
import cron from "node-cron";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { appointmentService } from "./app/modules/appointment/appointment.service";
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

cron.schedule("* * * * *", () => {
  try {
    appointmentService.cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
