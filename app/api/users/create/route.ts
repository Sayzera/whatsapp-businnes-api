import { v4 as uuidv4} from 'uuid'  
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function POST(req: Request) {
    try {
        const {
            name,
            phone,
            userId,
            status,
            companyId,
            companyName
        } = await req.json();

        if(!name || !phone || !userId || !status || !companyId || !companyName) {
            return new NextResponse("Invalid Request", { status: 400 })
        }

        const phoneExists = await db?.users?.findFirst({
            where: {
                userId: userId,
                phoneNumberList: {
                    some: {
                        phoneNumber: {
                            equals: phone
                        }
                    }
                }
            }
        })

        if(phoneExists) {
            return new NextResponse("Bu kullanıcı daha önceden kayıt olmuştur!", { status: 400 })
        }

        const companyExists = await db?.companies?.findFirst({
            where: {
                companyId: companyId
            }
        })

        let company = null;

        if(companyExists) {
            company = await db.companies.update({
                where: {
                    companyId: companyId,
                    users: {
                        some : {
                            userId: userId,
                            phoneNumberList: {
                                some: {
                                    phoneNumber: {
                                        not: phone
                                    }
                            }
                        }
                       }
                    }
                },
                data: {
                    users: {
                        create: {
                            id: uuidv4(),
                            userId: userId,
                            name: name,
                            status: status,
                            phoneNumberList: {
                                create: {
                                    id: uuidv4(),
                                    phoneNumber: phone,
                                    status:status
                                }
                            }
                        }
                    }
                }
            })
        } else {
            company = await db.companies.create({
                data: {
                    id: uuidv4(),
                    name: companyName,
                    companyId: companyId,
                    status: status,
                    users: {
                        create: {
                            id: uuidv4(),
                            userId: userId,
                            name: name,
                            status: status,
                            phoneNumberList: {
                                create: {
                                    id: uuidv4(),
                                    phoneNumber: phone,
                                    status:status
                                }
                            }
                        }
                    }
                }
            })
        }



        return NextResponse.json(company, { status: 200 })

     
    }catch(e) {
        console.log('[CREATE_USER_ERROR]', e)
        return new NextResponse("Internal Error", { status: 500 })
    }
}