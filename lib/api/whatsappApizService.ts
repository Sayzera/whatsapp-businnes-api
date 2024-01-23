import {
  ApizResultFileStatusData,
  WebhookData,
} from "@/types/api/webhook/get-whatsapp-message/types";
import axios from "axios";

class WhatsAppApizService {
  async queryFileNumber({ data }: WebhookData | any): Promise<{
    data: {
      success: boolean;
      data: {
        col_last_process_status: string;
        col_trademark: string;
      };
    };
  }> {
    const formData = new FormData();
    const text = data?.payload?.payload?.text;

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

    return responseData;
  }
}

export { WhatsAppApizService };
