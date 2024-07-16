import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt, apiKey } = await req.json();

  const openAIApiKey = apiKey || process.env.OPENAI_API_KEY;

  if(new Date() > new Date('2024-08-20')) {
    return new Response(`This API has expired`, {
      status: 410,
    });
  }

  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!openAIApiKey || openAIApiKey === "") {
    return new Response(`Missing OPENAI_API_KEY - make sure to configure it. You used: ${openAIApiKey}`, {
      status: 400,
    });
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`lotion_ratelimit_${ip}`);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  try {
    const openai = new OpenAI({
      apiKey: openAIApiKey,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imgUrl = response.data[0].url || '';
    return new Response(JSON.stringify({url: imgUrl}));

  } catch(error) {
    return new Response(error.message, {
      status: 400,
    });
  }
}
