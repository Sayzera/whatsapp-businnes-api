import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const apiUrl = "https://api.gupshup.io/wa/api/v1/msg";

  const headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    apikey: "y0fwulucncdyfuuqgurfznibf8necwkd",
  };

  const data = {
    channel: "whatsapp",
    source: "905370333756",
    destination: "905424336396",
    message: {
      type: "text",
      text: "Hi",
    },
    "src.name": "NiltekDev",
  };

  axios
    .post(apiUrl, data, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
}
