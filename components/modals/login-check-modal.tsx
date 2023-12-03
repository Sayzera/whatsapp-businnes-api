"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { CheckCheck } from "lucide-react";

interface LoginCheckResponseData {
  data: {
    col_email: string;
    col_id: number;
    col_username: string;
    firma_id: number;
    firma_adi: string;
  };
  success: boolean;
}

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Kullanıcı adı gereklidir",
  }),
  password: z.string().min(1, {
    message: "Şifre gereklidir",
  }),

  phone: z.string().min(1, {
    message: "Telefon numarası gereklidir",
  }),
});

export default function LoginCheckModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginMessage, setLoginMessage] = useState<
    string | any
  >(`Apiz whatsApp kanalını kullanabilmek için lütfen Apiz hesabınızla
  giriş yapınız.`);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);

    try {
      const {
        data,
      }: {
        data: LoginCheckResponseData;
      } = await axios.post(
        `${process.env.NEXT_PUBLIC_APIZ_URL}/whatsapp-business-find-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success === true) {
        setIsLogin(true);

        await axios.post("/api/users/create", {
          name: values.username,
          phone: values.phone,
          userId: data.data.col_id,
          status: true,
          companyId: data.data.firma_id,
          companyName: data.data.firma_adi,
        });

        setLoginMessage(
          "Giriş başarılı, whatsApp kanalını kullanmaya başlayabilirsiniz."
        );
      }
    } catch (err: any) {
      if (err?.response?.data && !err?.response?.data?.message) {
        setLoginMessage(err?.response?.data);
      } else if (err?.response?.data?.message) {
        setLoginMessage(err?.response?.data?.message);
      }

      setIsLogin(false);
    }
  };

  const isLoading = form.formState.isSubmitting;

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold mb-2">
            Apiz whatsApp Giriş Kontrolü
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {isLoginMessage}
          </DialogDescription>
        </DialogHeader>
        {isLogin && (
          <div className="flex justify-center  ">
            <div className="border border-1 p-2 rounded-full mb-2 border-green-500">
              <CheckCheck className="h-10 w-10 text-green-500  " />
            </div>
          </div>
        )}
        {!isLogin && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel
                          className={cn(
                            "text-xs font-bold text-zinc-500 dark:text-secondary/70",
                            form?.formState?.errors?.username && "text-red-500"
                          )}
                        >
                          Kullanıcı Adı (Apiz hesabınızın kullanıcı adı)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black 
                       focus-visible:ring-offset-0
                       "
                            disabled={isLoading}
                            placeholder="Kullanıcı adınızı giriniz"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs">
                          {form?.formState?.errors?.username?.message}
                        </FormMessage>
                      </FormItem>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel
                          className={cn(
                            "text-xs font-bold text-zinc-500 dark:text-secondary/70",
                            form?.formState?.errors?.phone && "text-red-500"
                          )}
                        >
                          Telefon Numarası (Kendi numaranızı giriniz)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black 
                       focus-visible:ring-offset-0
                       "
                            disabled={isLoading}
                            placeholder="Telefon numaranızı giriniz"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs">
                          {form?.formState?.errors?.phone?.message}
                        </FormMessage>
                      </FormItem>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormLabel
                          className={cn(
                            "text-xs font-bold text-zinc-500 dark:text-secondary/70",
                            form?.formState?.errors?.password && "text-red-500"
                          )}
                        >
                          Şifre (Apiz hesabınızın şifresi)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black 
                       focus-visible:ring-offset-0
                       "
                            disabled={isLoading}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs">
                          {form?.formState?.errors?.password?.message}
                        </FormMessage>
                      </FormItem>
                    </div>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button disabled={isLoading}>
                  {isLoading ? "Giriş yapılıyor..." : "Giriş yap"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
