import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  ApizResultFileStatusData,
  WebhookData,
} from "@/types/api/webhook/get-whatsapp-message/types";
import { userCheck } from "@/lib/api/existsUser";
import { WhatsAppApi } from "@/lib/api/whatsApp";
import { WhatsAppApizService } from "@/lib/api/whatsappApizService";

export async function POST(req: NextRequest) {
  const whatsAppApi = new WhatsAppApi();
  const whatsAppApiz = new WhatsAppApizService();
  const data: WebhookData = await req.json();
  // console.log("[Webhook Data]", data);

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
    }

    const responseData = await whatsAppApiz.queryFileNumber({ data });
    if (!responseData?.data.success) {
      return new NextResponse(
        `Merhaba ${existsUser.name}, '${text}' numaralı başvuru bulunamadı.  `,
        { status: 200 }
      );
    }

    let sendBasicMessage = await whatsAppApi.sendMessage({
      message: {
        type: "text",
        text: `Merhaba ${existsUser.name}, ${responseData.data.data.col_trademark} markası için başvuru durumunuz '${responseData.data.data.col_last_process_status}' olarak kayıtlıdır.`,
      },
      destination: data.payload.sender.phone,
    });
  } catch (error) {
    console.log("[Webhook Error]", error);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
