import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface WebhookData {
  app: string;
  timestamp: number;
  version: number;
  type: string;
  payload: {
    id: string;
    source: string;
    type: string;
    payload: any;
    sender: {
      phone: string;
      name: string;
      country_code: string;
      dial_code: string;
    };
    context: {
      id: string;
      gsId: string;
    };
  };
}

interface ApizResultFileStatusData {
  data: {
    data: {
        col_last_process_status: string;
        col_trademark: string;
    },
    success: boolean;

  }
}

export async function POST(req: NextRequest) {
  const data: WebhookData = await req.json();

  console.log("[Webhook Data]", data)

  if(data?.payload?.type !== "text") {
    return new NextResponse("Invalid Request", { status: 400 });
  }

  try {
    const existsUser = await db?.companies?.findFirst({
      where: {
        users: {
          some: {
            phoneNumberList: {
              some: {
                phoneNumber: {
                  equals: data?.payload?.sender?.phone,
                },
              },
            },
          },
        },
      },
    });

    if (!existsUser) {
      return new NextResponse(
        `Merhaba kullanıcı kaydınız bulunmamaktadır. Lütfen kayıt olunuz. Kayıt olmak için ${process.env.NEXT_PUBLIC_SITE_URL!} adresine gidiniz.`,
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

      if(!responseData.data.success) {
        return new NextResponse(
          `Merhaba ${existsUser.name}, '${text}' numaralı başvuru bulunamadı.  `,
          { status: 200 }
        );
      }

      return new NextResponse(
        `Merhaba ${existsUser.name}, ${responseData.data.data.col_trademark} markası için başvuru durumunuz '${responseData.data.data.col_last_process_status}' olarak kayıtlıdır.`,
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("[Webhook Error]", error);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
