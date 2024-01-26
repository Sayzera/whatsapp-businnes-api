import axios from "axios";
import { WhatsAppApi } from "./whatsAppApi";
import { questionsFN } from "@/data/whatsapp-api/api-questions";
type apizYimDataType = {
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

type apizYimOppDataType = {
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
      col_opp_type: string;
      col_opposition_due_date: string;
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

    const response: apizYimDataType = await axios.post(
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
      let tempWhassAppMessage: string = `Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz. \n`;
      await this.whatsappApi.sendMessage({
        message: tempWhassAppMessage,
        destination: destination,
      });

      return {
        success: false,
        message:
          "Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz.",
      };
    }

    let tempWhassAppMessage: string = `*${data.data.col_trademark}* Marka Bilgileri  \n`;
    tempWhassAppMessage += `\n`;
    tempWhassAppMessage += `*Başvuru Numarası*: ${data.data.col_application_number} \n`;
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

  async YURT_ICI_MARKA_ITIRAZ(fileNumber: string, destination: string) {
    const formData = new FormData();
    const text = fileNumber;

    formData.append("col_c_file_number", text);

    const response: apizYimOppDataType = await axios.post(
      `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/yim/result-file-objection-status`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let data = response.data;

    // Başvuru Numarası kontrolü
    if (data.success == false) {
      let tempWhassAppMessage: string = `Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz. \n`;
      await this.whatsappApi.sendMessage({
        message: tempWhassAppMessage,
        destination: destination,
      });

      return {
        success: false,
        message:
          "Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz.",
      };
    }

    let tempWhassAppMessage: string = `*${data.data.col_trademark}*  Marka Bilgileri  \n`;
    tempWhassAppMessage += `\n`;
    tempWhassAppMessage += `*Başvuru Numarası*: ${data.data.col_application_number} \n`;
    tempWhassAppMessage += `*İtiraz Tipi*: ${data.data.col_opp_type} \n`;
    tempWhassAppMessage += `*İtiraz Son Teslim Tarihi*: ${data.data.col_opposition_due_date} \n`;
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

  async YURT_DISI_MARKA_DURUMU(fileNumber: string, destination: string) {
    const formData = new FormData();
    const text = fileNumber;

    formData.append("col_c_file_number", text);

    const response: apizYimDataType = await axios.post(
      `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/yda_result-file-status`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let data = response.data;

    if (data.success == false) {
      let tempWhassAppMessage: string = `Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz. \n`;
      await this.whatsappApi.sendMessage({
        message: tempWhassAppMessage,
        destination: destination,
      });

      return {
        success: false,
        message:
          "Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz.",
      };
    }

    let tempWhassAppMessage: string = `*${data.data.col_trademark}* Marka Bilgileri  \n`;
    tempWhassAppMessage += `\n`;
    tempWhassAppMessage += `*Başvuru Numarası*: ${data.data.col_application_number} \n`;
    tempWhassAppMessage += `*Son Durumu*: ${data.data.col_last_status} \n`;

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
    let tempWhassAppMessage: string = `*Marka Bilgileri*  \n`;
    tempWhassAppMessage += `\n`;

    tempWhassAppMessage += `Bu özellik henüz aktif değildir. \n`;
    await this.whatsappApi.sendMessage({
      message: tempWhassAppMessage,
      destination: destination,
    });
  }

  async YURT_DISI_MARKA_ITIRAZ(fileNumber: string, destination: string) {
    const formData = new FormData();
    const text = fileNumber;

    formData.append("col_c_file_number", text);

    const response: apizYimOppDataType = await axios.post(
      `${process.env.NEXT_PUBLIC_APIZ_URL}/web/hook/whatsapp/yda/result-file-objection-status`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let data = response.data;

    // Başvuru Numarası kontrolü
    if (data.success == false) {
      let tempWhassAppMessage: string = `Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz. \n`;
      await this.whatsappApi.sendMessage({
        message: tempWhassAppMessage,
        destination: destination,
      });

      return {
        success: false,
        message:
          "Girilen Başvuru Numarası bulunamadı. Lütfen tekrar deneyiniz.",
      };
    }

    let tempWhassAppMessage: string = `*${data.data.col_trademark}*  Marka Bilgileri  \n`;
    tempWhassAppMessage += `\n`;
    tempWhassAppMessage += `*Başvuru Numarası*: ${data.data.col_application_number} \n`;
    tempWhassAppMessage += `*İtiraz Tipi*: ${data.data.col_opp_type} \n`;
    tempWhassAppMessage += `*İtiraz Son Teslim Tarihi*: ${data.data.col_opposition_due_date} \n`;
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
}

export { WhatsappActions };
