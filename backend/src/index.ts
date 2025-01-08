import { Hono } from "hono";
import { getDiagrams } from "./utils";
import zod from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { cors } from "hono/cors";

const queryInputSchema = zod.object({
  query: zod.string(),
});

const app = new Hono<{
  Bindings: {
    GROQ_API_KEY: string;
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

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCDiikf5hI17vKD0M9j06H5g6FxRcBzVVA",
  );

  const regex = await getDiagrams(genAI, data.query);

  return c.json(regex);
});

export default app;
