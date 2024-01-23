interface sendMessageProps {
  message: Record<string, unknown>;
  destination: number | string;
}

class WhatsAppApi {
  source: number = 905370333757;
  channel: string = "whatsapp";
  srcName: string = "NiltekDev";
  apikey: string = "y0fwulucncdyfuuqgurfznibf8necwkd";
  constructor() {}

  async sendMessage({ message, destination }: sendMessageProps) {
    const sdk = require("api")("@gupshup/v1.0#ezpvi10lcyl9hs6");
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
}

export { WhatsAppApi };
