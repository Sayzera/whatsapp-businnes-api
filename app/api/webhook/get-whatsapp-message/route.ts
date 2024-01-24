import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { WebhookData } from "@/types/api/webhook/get-whatsapp-message/types";
import { userCheck } from "@/lib/api/existsUser";
import { WhatsAppApi } from "@/lib/api/whatsAppApi";
import { WhatsAppApizService } from "@/lib/api/whatsappApizService";

export async function POST(req: NextRequest) {
  const whatsAppApi = new WhatsAppApi();
  const whatsAppApiz = new WhatsAppApizService();
  const data: WebhookData = await req.json();

  const text = data?.payload?.payload?.text;
  // console.log("[Webhook Data]", data);
  console.log("[Webhook Data]", data);
  if (data.type !== "message") {
    return new NextResponse("Invalid Request", { status: 400 });
  }

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

    if (
      data?.type === "message" &&
      data.payload.payload.type === "button_reply"
    ) {
      await whatsAppApi.sendQuickReplyMessage({
        destination: data.payload.sender.phone,
        message: {
          content: {
            type: "text",
            header: "Apiz - İşlemler",
            text: "Aşağıdaki işlemlerden birini seçiniz. ",
            caption: "Ankara Patent - Apiz",
          },
          type: "quick_reply",
          msgid: data.payload.id,
          options: [
            { type: "text", title: "Yurt İçi Markalarım" },
            { type: "text", title: "Patent" },
            { type: "text", title: "Tasarım" },
          ],
        },
      });
    }

    // let sendBasicMessage = await whatsAppApi.sendMessage({
    //   message: {
    //     type: "text",
    //     text: `Merhaba ${existsUser.name}, *${responseData.data.data.col_trademark}* markası için başvuru durumunuz '*${responseData.data.data.col_last_process_status}*' olarak kayıtlıdır.`,
    //   },
    //   destination: data.payload.sender.phone,
    // });

    return new NextResponse("OK", { status: 400 });
  } catch (error) {
    console.log("[Webhook Error]", error);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
