import { Router } from "express";
import { adminRouter } from "../modules/admin/admin.routes";
import { appointmentRoutes } from "../modules/appointment/appointment.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { doctorRoutes } from "../modules/doctor/doctor.routes";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";
import { patientRoutes } from "../modules/patient/patient.routes";
import { scheduleRoutes } from "../modules/schedule/schedule.routes";
import { specialitiesRoutes } from "../modules/specialities/specialities.routes";
import { userRouter } from "../modules/user/user.routes";

const router = Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/speciality",
    route: specialitiesRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
