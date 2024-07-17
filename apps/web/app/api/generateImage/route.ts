import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest } from "next";

const allowedOrigins = ['http://localhost:5000', 'https://yourapp.vercel.app'];

export async function OPTIONS(req: NextRequest, res: NextResponse): Promise<NextResponse> {

  const origin = req.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      },
      status: 200,
    });
  }

  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
    status: 200,
  });
}

export async function POST(req: NextRequest, res: NextResponse): Promise<NextResponse> {
  const { prompt, apiKey } = await req.json();

  const openAIApiKey = apiKey || process.env.OPENAI_API_KEY;

  if(new Date() > new Date('2024-08-20')) {
    return new NextResponse(`This API has expired`, {
      status: 410,
    });
  }

  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!openAIApiKey || openAIApiKey === "") {
    return new NextResponse(`Missing OPENAI_API_KEY - make sure to configure it. You used: ${openAIApiKey}`, {
      status: 400,
    });
  }

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers["x-forwarded-for"];
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`lotion_ratelimit_${ip}`);

    if (!success) {
      return new NextResponse("You have reached your request limit for the day.", {
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
    return new NextResponse(JSON.stringify({url: imgUrl}));

  } catch(error) {
    return new NextResponse(error.message, {
      status: 400,
    });
  }
}
