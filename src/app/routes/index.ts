import { Router } from "express";
import { adminRouter } from "../modules/admin/admin.routes";
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
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
