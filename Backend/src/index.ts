import app from "./app";
import { env } from "./env";
import { connectDB } from "./DB/connect";

async function start() {
  await connectDB();
  console.log(env.PORT);

  console.log();

  app.listen(env.PORT, () => {
    console.log(`Pharmacy API running on http://localhost:${env.PORT}`);
  });

}

start();
