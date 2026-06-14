const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "123456";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.requestedRole = "admin";
      existingAdmin.roleStatus = "approved";
      existingAdmin.approvedAt = new Date();

      await existingAdmin.save();

      console.log("Existing user updated as admin");
      console.log({
        email: existingAdmin.email,
        role: existingAdmin.role,
        requestedRole: existingAdmin.requestedRole,
        roleStatus: existingAdmin.roleStatus,
      });
    } else {
      const admin = await User.create({
        name: "Admin Root",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        requestedRole: "admin",
        roleStatus: "approved",
        approvedAt: new Date(),
      });

      console.log("New admin created");
      console.log({
        email: admin.email,
        role: admin.role,
        requestedRole: admin.requestedRole,
        roleStatus: admin.roleStatus,
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();