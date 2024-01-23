import { NextRequest, NextResponse } from "next/server";
const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");

export async function POST(req: NextRequest) {
  try {
    const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");

    sdk
      .postMsg(
        {
          message:
            '{"type":"list","title":"title text","body":"body text","msgid":"ABEGkFQkM2OWAhD-8YT6BCZNaIe8wgNSj_mk","globalButtons":[{"type":"text","title":"Kabul Et"},{"type":"text","title":"Global button"}],"items":[{"title":"first Section","subtitle":"first Subtitle"}]}',
          encode: true,
          disablePreview: true,
          "src.name": "NiltekDev",
          channel: "whatsapp",
          source: 905370333757,
          destination: 905424336396,
        },
        {
          apikey: "y0fwulucncdyfuuqgurfznibf8necwkd",
        }
      )
      .then(({ data }: any) => console.log(data))
      .catch((err: any) => console.error(err));

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 400 });
  }
}
