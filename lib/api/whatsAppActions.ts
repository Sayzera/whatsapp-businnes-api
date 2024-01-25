import axios from "axios";
import { WhatsAppApi } from "./whatsAppApi";
import { questionsFN } from "@/data/whatsapp-api/api-questions";
type apizDataType = {
  data: {
    message: string;
    success: boolean;
    data: {
      col_id: number;
      col_is_deleted: boolean;
      col_file_number: string;
      col_c_file_number: string;
      col_trademark: string;
      col_class_string: string;
      col_application_number: string;
      col_application_date: string;
      col_account_code: string;
      col_account_title: string;
      col_last_status: string;
      col_last_process: string;
      col_last_process_status: string;
      ref_account: number;
    };
  };
};
class WhatsappActions {
  whatsappApi: WhatsAppApi;
  constructor() {
    this.whatsappApi = new WhatsAppApi();
  }
  async YURT_ICI_MARKA_DURUMU(fileNumber: string, destination: string) {
    const formData = new FormData();
    const text = fileNumber;

    formData.append("col_c_file_number", text);

    const response: apizDataType = await axios.post(
      `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/result-file-status`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let data = response.data;

    if (data.success == false) {
      let tempWhassAppMessage: string = `Girilen dosya numarası bulunamadı. Lütfen tekrar deneyiniz. \n`;
      await this.whatsappApi.sendMessage({
        message: tempWhassAppMessage,
        destination: destination,
      });

      return {
        success: false,
        message: "Girilen dosya numarası bulunamadı. Lütfen tekrar deneyiniz.",
      };
    }
    0;

    let tempWhassAppMessage: string = `*${data.data.col_trademark}* marka bilgileri  \n`;
    tempWhassAppMessage += `\n`;
    tempWhassAppMessage += `*Dosya Numarası*: ${data.data.col_application_number} \n`;
    tempWhassAppMessage += `*Son Durumu*: ${data.data.col_last_status} \n`;
    tempWhassAppMessage += `*Son İşlemi*: ${data.data.col_last_process} \n`;

    this.whatsappApi.sendMessage({
      message: tempWhassAppMessage,
      destination: destination,
    });

    return {
      success: true,
      message: "Message sent successfully",
    };
  }

  async YAPIM_ASAMASINDA(destination: string) {
    let tempWhassAppMessage: string = `*Marka bilgileri*  \n`;
    tempWhassAppMessage += `\n`;

    tempWhassAppMessage += `Bu özellik henüz aktif değildir. \n`;
    await this.whatsappApi.sendMessage({
      message: tempWhassAppMessage,
      destination: destination,
    });
  }
}

export { WhatsappActions };
