import { Router } from "express";
import { adminRouter } from "../modules/admin/admin.routes";
import { authRouter } from "../modules/auth/auth.routes";
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
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/speciality",
    route: specialitiesRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
