import { createElysia } from "@/libs/elysia";
import * as cheerio from "cheerio";

export default createElysia()
  .get("/", async () => {
  }, {
    detail: {
      tags: ["TV Series"],
    }
  });