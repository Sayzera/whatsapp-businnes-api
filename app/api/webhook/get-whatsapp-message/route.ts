import { db } from "@/lib/db";
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
    const data: WebhookData = await req.json()

    try {
        const existsUser =  await db?.companies?.findFirst({
            where: {
                users: {
                    some: {
                        phoneNumberList: {
                            some: {
                                phoneNumber: {
                                    equals: data.payload.sender.phone
                                }
                            }
                        
                        }
                    }
                }
            }
        })

        if(!existsUser) {
            return NextResponse.json({
                data: `
                    Merhaba kullanıcı kaydınız bulunmamaktadır. Lütfen kayıt olunuz.
                    Kayıt olmak için ${
                        process.env.NEXT_PUBLIC_SITE_URL!
                    } adresine gidiniz.
                `
            },{
                status: 200
            })
        } else {
            return NextResponse.json({
                data: `Merhaba ${existsUser.name},
                Sistemiz üzerinden gelen mesajınız alınmıştır. En kısa sürede size dönüş yapılacaktır.
                `
            })
        }

    } catch (error) {
        console.log('[Webhook Error]', error)
        return new NextResponse("Invalid Request", { status: 400 })
    }

   

    
}