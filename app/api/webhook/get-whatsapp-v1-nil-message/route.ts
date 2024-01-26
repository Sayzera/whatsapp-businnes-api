import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { WebhookData } from "@/types/api/webhook/get-whatsapp-message/types";
import { userCheck } from "@/lib/api/existsUser";
import { WhatsAppApi } from "@/lib/api/whatsAppApi";
import {
  answerQuestion,
  ifNotExistsQuestion,
  questionBank,
  questionsFN,
} from "@/data/whatsapp-api/api-questions";
import { DBService } from "@/lib/api/dbService";

export async function POST(req: NextRequest) {
  const whatsAppApi = new WhatsAppApi();
  const data: WebhookData = await req.json();
  const dbService = new DBService();

  if (!data?.payload?.payload?.text) {
    return new NextResponse(null, { status: 200 });
  }

  const existsUser = await userCheck(db, data?.payload?.sender?.phone);
  const destination = data?.payload?.sender?.phone;

  if (!existsUser) {
    return new NextResponse(
      `Merhaba kullanıcı kaydınız bulunmamaktadır. Lütfen kayıt olunuz. Kayıt olmak için ${process
        .env.NEXT_PUBLIC_SITE_URL!} adresine gidiniz.`,
      {
        status: 200,
      }
    );
  }
  const existsWelcomeMessage = await dbService._existsWelcomeMessage(data);

  // Eğer aksiyon bulunamadıysa soruları gönder
  if (!existsWelcomeMessage.data) {
    await whatsAppApi.sendMessage({
      message: questionsFN(),
      destination: destination,
    });
    await dbService._welcomeMessage(data);
    return new NextResponse(null, { status: 200 });
  }

  // Hangi Aşamada olduğunu bul
  const findUserAction = await dbService._findUserAction(data);

  // örnek olarak 1 göndermiş oluyor
  if (!findUserAction.data?.steps.length) {
    // Cevap Kontrolü Yap
    let action = questionBank.filter(
      (question) => question.id == data.payload.payload.text.trim()
    );

    // Eğer yanlış bir veri girildiyse
    if (action.length === 0) {
      await whatsAppApi.sendMessage({
        message: ifNotExistsQuestion(),
        destination: destination,
      });
      return new NextResponse(null, { status: 200 });
    }
    // Gelen Soruyu Kaydet
    const actionResult = await dbService._userActions(data);
    // Cevap İste
    await whatsAppApi.sendMessage({
      message: answerQuestion(action[0].title),
      destination: destination,
    });

    return new NextResponse(null, { status: 200 });
  }

  // cevapla buraya örnek Başvuru Numarası geliyor
  const answerMessage = await dbService._answerMessage(data);
  return new NextResponse(null, { status: 200 });
}
