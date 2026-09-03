import mongoose from "mongoose";
import { env } from "../env";
import dns from "dns"

const configureDnsServers = (): void => {
  const defaultServers = ["8.8.8.8", "1.1.1.1"];
  const envServers = process.env.DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);

  const servers = envServers && envServers.length > 0 ? envServers : defaultServers;
  dns.setServers(servers);
  console.log("Using DNS servers:", servers.join(", "));
};

export async function connectDB() {

  configureDnsServers();
  
  try {
    console.log(env.MONGO_URI);
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
