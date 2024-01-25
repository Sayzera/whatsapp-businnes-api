export const questionsFN = (): string => {
  let tempWhassAppMessage: string = "";

  const whatsAppQuestionData = {
    header: "🔎 Apiz - İşlemler",
    description:
      "Aşağıdaki listeden yapmak istediğiniz işlemin sadece *numarasını* yazıp gönderiniz.",
    _questions: [
      {
        id: "1",
        type: "text",
        title: "Yurt İçi Marka Durumu",
      },
      {
        id: "2",
        type: "text",
        title: "Yurt İçi Marka İtiraz",
      },
      {
        id: "3",
        type: "text",
        title: "Yurt Dışına Marka Durumu",
      },
      {
        id: "4",
        type: "text",
        title: "Yurt Dışına Marka İtiraz",
      },
    ],
  };

  tempWhassAppMessage += `*${whatsAppQuestionData.header}* \n`;
  tempWhassAppMessage += `\n`;
  tempWhassAppMessage += `${whatsAppQuestionData.description} \n`;
  tempWhassAppMessage += `\n`;

  whatsAppQuestionData._questions.forEach((item, index) => {
    tempWhassAppMessage += `${index + 1}. ${item.title} \n`;
  });

  return tempWhassAppMessage as string;
};

export const ifNotExistsQuestion = (): string => {
  return `Yanlış bir değer girdiniz. Lütfen tekrar deneyiniz. `;
};

// cevap iste
export const answerQuestion = (title: string): string => {
  return `${title} işlemi için lütfen başvuru numaranızı giriniz. `;
};

export const questionBank = [
  {
    id: "1",
    type: "text",
    title: "Yurt İçi Marka Durumu",
    actionMethod: "YURT_ICI_MARKA_DURUMU",
    step: 1,
    question: "Lütfen marka başvuru numaranızı giriniz.",
  },
  {
    id: "2",
    type: "text",
    title: "Yurt İçi Marka İtiraz",
    actionMethod: "YURT_ICI_MARKA_ITIRAZ",
    step: 1,
    question: "Lütfen marka başvuru numaranızı giriniz.",
  },
  {
    id: "3",
    type: "text",
    title: "Yurt Dışına Marka Durumu",
    actionMethod: "YURT_DISI_MARKA_DURUMU",
    step: 1,
    question: "Lütfen marka başvuru numaranızı giriniz.",
  },
  {
    id: "4",
    type: "text",
    title: "Yurt Dışına Marka İtiraz",
    actionMethod: "YURT_DISI_MARKA_ITIRAZ",
    step: 1,
    question: "Lütfen marka başvuru numaranızı giriniz.",
  },
];
