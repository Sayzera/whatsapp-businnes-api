
export const userCheck = async (db:any, phone: string) => {
   let result = await db?.companies?.findFirst({
        where: {
          users: {
            some: {
              phoneNumberList: {
                some: {
                  phoneNumber: {
                    equals: phone
                  },
                },
              },
            },
          },
        },
      });

      return result;
}