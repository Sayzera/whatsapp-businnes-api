import { NextRequest, NextResponse } from "next/server";

interface WebhookData { 
    app: string;
    timestamp: number;
    version: number;
    type: string;
    payload: {
        id: string;
        source: string;
        type:string;
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
    }
}


export async function POST(req: NextRequest) {
    const data = req.body as WebhookData | null;

    console.log(data);

    try {
        return NextResponse.json({
           data: data
        },{
            status: 200
        })
    }catch(error) {

    }
}