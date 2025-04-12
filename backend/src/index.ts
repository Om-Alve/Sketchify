import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getDiagrams } from "./utils";
import zod from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { cors } from "hono/cors";

const queryInputSchema = zod.object({
  query: zod.string(),
});

const app = new Hono<{
  Bindings: {
    GOOGLE_API_KEY: string;
  };
}>().basePath("api/v1/");

app.use(cors());

app.post("/", async (c) => {
  const query = await c.req.json();
  const { success, data } = queryInputSchema.safeParse(query);

  if (!success) {
    return c.json({
      message: "Invalid Inputs",
    });
  }

  const genAI = new GoogleGenerativeAI(c.env.GOOGLE_API_KEY);

  const regex = await getDiagrams(genAI, data.query);

  return c.json(regex);
});

const port = process.env.PORT || 8000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
