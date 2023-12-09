export interface WebhookData {
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

  export interface ApizResultFileStatusData {
    data: {
      data: {
          col_last_process_status: string;
          col_trademark: string;
      },
      success: boolean;
  
    }
  }