const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");

interface sendMessageProps {
  message: Record<string, unknown>;
  destination: number | string;
}

interface interactiveMessageProps {
  message: Record<string, unknown>;
  destination: number | string;
  msgid: string;
}

interface quickReplyMessageProps {
  destination: number | string;
  msgid: string;
}

class WhatsAppApi {
  source: number = 905370333757;
  channel: string = "whatsapp";
  srcName: string = "NiltekDev";
  apikey: string = "y0fwulucncdyfuuqgurfznibf8necwkd";
  constructor() {}

  async sendMessage({ message, destination }: sendMessageProps) {
    try {
      sdk
        .postMsg(
          {
            channel: this.channel,
            source: this.source,
            destination: destination,
            message: JSON.stringify(message),
            "src.name": this.srcName,
            disablePreview: false,
            encode: false,
          },
          {
            apikey: this.apikey,
          }
        )
        // .then(({ data }) => console.log(data))
        .catch((err: any) => console.error(err));

      return {
        success: true,
        message: "Message sent successfully",
      };
    } catch (error: any) {
      console.log("[ERROR] WhatsAppApi.sendMessage()", error);
      return {
        success: false,
        message: "Message could not be sent",
      };
    }
  }

  async sendInteractiveMessage({
    message,
    destination,
    msgid,
  }: interactiveMessageProps) {
    sdk.postMsg(
      {
        message: JSON.stringify({
          type: "list",
          title: "title text",
          body: "body text",
          msgid: msgid,
          globalButtons: [
            { type: "text", title: "Kabul Et" },
            { type: "text", title: "Global button" },
          ],
          items: [{ title: "first Section", subtitle: "first Subtitle" }],
        }),
        encode: true,
        disablePreview: true,
        "src.name": this.srcName,
        channel: this.channel,
        source: this.source,
        destination: destination,
      },
      {
        apikey: this.apikey,
      }
    );
  }

  async sendQuickReplyMessage({ destination, msgid }: quickReplyMessageProps) {
    console.log("sendQuickReplyMessage", {
      destination,
      msgid,
    });
    try {
      await sdk.postMsg(
        {
          message: JSON.stringify({
            content: {
              type: "text",
              header: "this is the header",
              text: "this is the body",
              caption: "this is the footer",
            },
            type: "quick_reply",
            msgid: msgid,
            options: [
              { type: "text", title: "deneme12323" },
              { type: "text", title: "First" },
            ],
          }),
          encode: true,
          disablePreview: true,
          "src.name": "NiltekDev",
          channel: "whatsapp",
          source: this.source,
          destination: destination,
        },
        {
          apikey: "y0fwulucncdyfuuqgurfznibf8necwkd",
        }
      );
    } catch (error: any) {
      console.log("[ERROR] WhatsAppApi.sendQuickReplyMessage()", error);
      return {
        success: false,
        message: "Message could not be sent",
      };
    }
  }
}

export { WhatsAppApi };
