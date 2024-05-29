import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../src/config";
import prisma from "../src/utils/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.superAdmin,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.super_admin.pass as string,
      12
    );

    const superAdminData = await prisma.user.create({
      data: {
        email: config.super_admin.email as string,
        password: hashedPassword,
        role: UserRole.superAdmin,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01234567890",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully!", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
