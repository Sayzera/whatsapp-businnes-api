const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");

interface sendMessageProps {
  message: Record<string, unknown> | string;
  destination: number | string;
}

interface interactiveMessageProps {
  message: Record<string, unknown>;
  destination: number | string;
  msgid: string;
}

interface quickReplyMessageProps {
  destination: number | string;
  message: Record<string, unknown>;
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
            message: message,
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

  async sendQuickReplyMessage({
    destination,
    message,
  }: quickReplyMessageProps) {
    try {
      await sdk.postMsg(
        {
          message: JSON.stringify(message),
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
