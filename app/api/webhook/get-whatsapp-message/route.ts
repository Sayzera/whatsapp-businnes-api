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

      const responseData: ApizResultFileStatusData = await axios.post(
        `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/result-file-status`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!responseData.data.success) {
        return new NextResponse(
          `Merhaba ${existsUser.name}, '${text}' numaralı başvuru bulunamadı.  `,
          { status: 200 }
        );
      }

      // return new NextResponse(
      //   `Merhaba ${existsUser.name}, ${responseData.data.data.col_trademark} markası için başvuru durumunuz '${responseData.data.data.col_last_process_status}' olarak kayıtlıdır.`,
      //   { status: 200 }
      // );

      return NextResponse.json(
        {
          interactive: {
            type: "list",
            header: {
              type: "text",
              text: "your-header-content",
            },
            body: {
              text: "your-text-message-content",
            },
            footer: {
              text: "your-footer-content",
            },
            action: {
              button: "cta-button-content",
              sections: [
                {
                  title: "your-section-title-content",
                  rows: [
                    {
                      id: "unique-row-identifier",
                      title: "row-title-content",
                      description: "row-description-content",
                    },
                  ],
                },
                {
                  title: "your-section-title-content",
                  rows: [
                    {
                      id: "unique-row-identifier",
                      title: "row-title-content",
                      description: "row-description-content",
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("[Webhook Error]", error);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
