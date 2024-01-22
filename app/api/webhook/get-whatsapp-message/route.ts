const sdk = require("api")("@gupshup/v1.0#1keni1zln44xoxq");
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  ApizResultFileStatusData,
  WebhookData,
} from "@/types/api/webhook/get-whatsapp-message/types";
import { userCheck } from "@/lib/api/existsUser";

export async function POST(req: NextRequest) {
  const data: WebhookData = await req.json();

  if (data?.payload?.type !== "text") {
    return new NextResponse("Invalid Request", { status: 400 });
  }

  try {
    // Kullanıcı kayıtlı mı kontrol et
    const existsUser = await userCheck(db, data?.payload?.sender?.phone);

    if (!existsUser) {
      return new NextResponse(
        `Merhaba kullanıcı kaydınız bulunmamaktadır. Lütfen kayıt olunuz. Kayıt olmak için ${process
          .env.NEXT_PUBLIC_SITE_URL!} adresine gidiniz.`,
        {
          status: 200,
        }
      );
    } else {
      const formData = new FormData();
      const text = data.payload?.payload?.text;
      formData.append("col_application_number", text);

      console.log(data);

      const responseData: ApizResultFileStatusData = await axios.post(
        `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/result-file-status`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // if (!responseData.data.success) {
      //   return new NextResponse(
      //     `Merhaba ${existsUser.name}, '${text}' numaralı başvuru bulunamadı.  `,
      //     { status: 200 }
      //   );
      // }

      // return new NextResponse(
      //   `Merhaba ${existsUser.name}, ${responseData.data.data.col_trademark} markası için başvuru durumunuz '${responseData.data.data.col_last_process_status}' olarak kayıtlıdır.`,
      //   { status: 200 }
      // );
      sdk
        .sendMessage(
          {
            disablePreview: true,
            channel: "whatsapp",
            message: "test1234",
            destination: data.payload.sender.phone,
            "src.name": "NiltekDev",
            source: "905370333756",
          },
          {
            accept: "application/x-www-form-urlencoded",
            apikey: "y0fwulucncdyfuuqgurfznibf8necwkd",
          }
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.error(err));
    }
  } catch (error) {
    console.log("[Webhook Error]", error);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
