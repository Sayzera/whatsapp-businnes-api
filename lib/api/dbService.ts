import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

import { WebhookData } from "@/types/api/webhook/get-whatsapp-message/types";
import { NextResponse } from "next/server";
import { Actions } from "@prisma/client";
import { WhatsappActions } from "./whatsAppActions";

interface findUserAction {
  status: number;
  data?: {
    id: string;
    step: number;
    status: boolean;
    action: Actions;
    userId: string;
    phoneNumber: string;
    steps: Array<{
      id: string;
      step: number;
      status: boolean;
      deleted: boolean;
      answer: string;
      userId: string;
      stepId: string;
    }>;
  };
  step:
    | {
        id: string;
        step: number;
        answer: string;
        userId: string;
        stepId: string;
      }[]
    | {};
  message: string;
}

class DBService {
  async _userActions(data: WebhookData) {
    const destination = data?.payload?.sender?.phone;
    const payloadText = data?.payload?.payload?.text;

    try {
      let actionName: Actions = Actions.YURT_ICI_MARKA_DURUMU;

      if (!payloadText) {
        return new NextResponse("Payload text not found", { status: 400 });
      }
      if (!destination) {
        return new NextResponse("Destination not found", { status: 400 });
      }

      switch (payloadText) {
        case "1":
          actionName = Actions.YURT_ICI_MARKA_DURUMU;
          break;
        case "2":
          actionName = Actions.YURT_ICI_MARKA_ITIRAZ;
          break;
        case "3":
          actionName = Actions.YURT_DISI_MARKA_DURUMU;
          break;
        case "4":
          actionName = Actions.YURT_DISI_MARKA_ITIRAZ;
          break;
      }

      // kullanıcıyı bul
      const user = await db.users.findFirst({
        where: {
          phoneNumberList: {
            some: {
              phoneNumber: destination,
            },
          },
        },
      });

      if (!user) {
        return new NextResponse("User not found", { status: 400 });
      }

      // Kullanıcı aksiyonu daha önceden var mı?

      const existsUserAction = await db?.userActions?.findFirst({
        where: {
          phoneNumber: destination,
          status: true,
        },
        include: {
          steps: true,
        },
      });

      if (existsUserAction) {
        // Kullanıcı aksiyonu var ise güncelle
        const userAction = await db.userActions.update({
          where: {
            id: existsUserAction.id,
            status: true,
          },
          data: {
            steps: {
              create: {
                id: uuidv4(),
                step: existsUserAction.steps.length + 1,
                answer: payloadText,
                userId: user.id,
                status: true,
                deleted: false,
              },
            },
          },
        });

        return {
          status: 200,
          data: userAction,
          message: "User action updated",
        };
      } else {
        // Henüz bir kullanıcı aksiyonu oluşmamış ise oluştur
        const userAction = await db.userActions.create({
          data: {
            id: uuidv4(),
            userId: user.id,
            phoneNumber: destination.toString(),
            status: true,
            deleted: false,
            action: actionName,
            steps: {
              create: {
                id: uuidv4(),
                step: 1,
                answer: payloadText,
                userId: user.id,
                status: true,
                deleted: false,
              },
            },
          },
        });

        return {
          status: 200,
          data: userAction,
          message: "User action created",
        };
      }
    } catch (error) {
      console.log("[DBService] userActions error: ", error);
      return {
        status: 400,
        data: null,
        message: error,
      };
    }
  }
  async _findUserAction(data: WebhookData): Promise<findUserAction> {
    const destination = data?.payload?.sender?.phone;

    try {
      if (!destination) {
        return {
          status: 400,
          data: undefined,
          step: [],
          message: "Destination not found",
        };
      }

      const userActions = await db?.userActions.findFirst({
        where: {
          phoneNumber: destination,
          status: true,
        },
        include: {
          steps: true,
        },
      });

      if (!userActions) {
        return {
          status: 200,
          data: undefined,
          step: [],
          message: "User action not found",
        };
      }

      const userAction = userActions.steps;

      return {
        status: 200,
        data: userActions,
        step: userAction[userAction.length - 1],
        message: "User action found",
      };
    } catch (error: any) {
      console.log("[DBService] _findUserAction error: ", error);
      return {
        status: 400,
        step: [],
        data: undefined,
        message: error,
      };
    }
  }
  // Kullanıcıyı bir kez karşılamak için
  async _welcomeMessage(data: WebhookData) {
    try {
      const destination = data?.payload?.sender?.phone;

      const existsWelcomeMessage = await db.welcomeMessagesAction.findFirst({
        where: {
          phoneNumber: destination,
        },
      });

      if (existsWelcomeMessage) {
        return {
          status: 200,
          message: "Welcome message already exists",
          data: existsWelcomeMessage,
        };
      }

      const welcomeData = await db.welcomeMessagesAction.create({
        data: {
          id: uuidv4(),
          phoneNumber: destination,
          status: true,
          deleted: false,
        },
      });

      return {
        status: 200,
        message: "Welcome message created",
        data: welcomeData,
      };
    } catch (error) {}
  }
  async _existsWelcomeMessage(data: WebhookData) {
    try {
      const destination = data?.payload?.sender?.phone;

      const existsWelcomeMessage = await db.welcomeMessagesAction.findFirst({
        where: {
          phoneNumber: destination,
        },
      });

      if (existsWelcomeMessage) {
        return {
          status: 200,
          message: "Welcome message already exists",
          data: existsWelcomeMessage,
        };
      }

      return {
        status: 200,
        message: "Welcome message not found",
        data: null,
      };
    } catch (error) {
      console.log("[DBService] _existsWelcomeMessage error: ", error);
      return {
        status: 400,
        message: error,
        data: null,
      };
    }
  }

  // cevabı yanıtla
  async _answerMessage(data: WebhookData) {
    try {
      const destination = data?.payload?.sender?.phone;
      const text = data?.payload?.payload?.text;

      const userActionData = await db.userActions.findFirst({
        where: {
          phoneNumber: destination,
          status: true,
        },
        include: {
          steps: true,
          User: true,
        },
      });

      if (!userActionData) {
        return {
          status: 200,
          message: "User action not found",
          data: null,
        };
      }

      let whatsAppActions = new WhatsappActions();
      // İşlem türü

      if (userActionData.action === "YURT_ICI_MARKA_DURUMU") {
        let response = await whatsAppActions.YURT_ICI_MARKA_DURUMU(
          text,
          destination
        );

        if (response.success === true) {
          await this._clearUserAction(destination);
        }

        return response;
      }

      if (userActionData.action === "YURT_ICI_MARKA_ITIRAZ") {
        await whatsAppActions.YAPIM_ASAMASINDA(destination);
        await this._clearUserAction(destination);
      }

      if (userActionData.action === "YURT_DISI_MARKA_DURUMU") {
        await whatsAppActions.YAPIM_ASAMASINDA(destination);
        await this._clearUserAction(destination);
      }

      if (userActionData.action === "YURT_DISI_MARKA_ITIRAZ") {
        await whatsAppActions.YAPIM_ASAMASINDA(destination);
        await this._clearUserAction(destination);
      }

      return {
        status: 200,
        message: "User action found",
        data: userActionData,
      };
    } catch (error: any) {
      console.log("[DBService] _answerMessage error: ", error);
      return {
        status: 400,
        message: error,
        data: null,
      };
    }
  }

  async _clearUserAction(destination: string) {
    try {
      const userActionData = await db.userActions.findFirst({
        where: {
          phoneNumber: destination,
          status: true,
        },
        include: {
          steps: true,
          User: true,
        },
      });

      if (!userActionData) {
        return {
          status: 200,
          message: "User action not found",
          data: null,
        };
      }

      // delete user welcome

      await db.welcomeMessagesAction.deleteMany({
        where: {
          phoneNumber: destination,
        },
      });

      const userAction = await db.userActions.update({
        where: {
          id: userActionData.id,
        },
        data: {
          status: false,
        },
      });

      return {
        status: 200,
        message: "User action updated",
        data: userAction,
      };
    } catch (error: any) {
      console.log("[DBService] _clearUserAction error: ", error);
      return {
        status: 400,
        message: error,
        data: null,
      };
    }
  }
}

export { DBService };
