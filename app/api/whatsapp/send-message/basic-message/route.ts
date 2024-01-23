import { NextRequest, NextResponse } from "next/server";
const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");

export async function POST(req: NextRequest) {
  try {
    sdk
      .postMsg(
        {
          channel: "whatsapp",
          source: 905370333757,
          destination: 905424336396,
          message: '{"type":"text","text":"Hello user, how are you?"}',
          "src.name": "NiltekDev",
          disablePreview: false,
          encode: false,
        },
        {
          apikey: "y0fwulucncdyfuuqgurfznibf8necwkd",
        }
      )
      // .then(({ data }) => console.log(data))
      .catch((err: any) => console.error(err));
    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 400 });
  }
}
