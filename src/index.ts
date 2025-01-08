import { baseElysia } from "@/libs/elysia";
import apiRoutes from "./api";
import cors from "@elysiajs/cors";
import { docs } from "@/libs/swagger";

const app = baseElysia()
  .use(cors({
    origin: [
      "http://localhost:3000",
      "https://rizkyhaksono.vercel.app",
      "https://natee.me",
      "https://otakudesu.natee.me",
      "https://otakudesu.natee.my.id",
      "localhost:3000",
      "rizkyhaksono.vercel.app",
      "natee.me",
      "otakudesu.natee.me",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(docs)
  .use(apiRoutes)
  .get("/", () => "Hello natee")
  .listen(Bun.env.PORT ?? 3031);

console.log(
  `🦊 Nateeflix is running at ${Bun.env.NODE_ENV === "development" ? "http://" : "https://"}${app.server?.hostname}:${app.server?.port}`
);