"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormData, loginSchema } from "@/schemas/authSchema";
import authService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLoginSubmit(data: LoginFormData) {
    console.log("Login submitted:", data);

    try {
      const { success } = await authService.login({
        email: data.email,
        password: data.password,
      });
      if (success) {
        toast.success("Login successful!");
        router.push("/dashboard/bookings");
      }
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <div className="mt-5 px-2 flex items-center text-gray-500/50 dark:gray-300/40 focus-within:text-black dark:focus-within:text-gray-300/70 border border-gray-500/50 dark:border-gray-300/40 focus-within:border-black dark:focus-within:border-gray-300/70 transition-colors duration-300">
                    <User />
                    <input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="px-3 py-2.5 outline-none w-full dark:placeholder:text-gray-400/50 dark:text-gray-400"
                    />
                  </div>
                  <FormMessage className="mt-2 text-sm text-red-600 font-medium" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full">
                  <div className="mt-5 px-2 flex items-center text-gray-500/50 dark:gray-300/40 focus-within:text-black dark:focus-within:text-gray-300/70 border border-gray-500/50 dark:border-gray-300/40 focus-within:border-black dark:focus-within:border-gray-300/70 transition-colors duration-300">
                    <Key />
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="px-3 py-2.5 outline-none w-full dark:placeholder:text-gray-400/50 dark:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="mt-2 text-sm text-red-600 font-medium" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full">
          <button className="bg-gradient-animate hover-pulse mt-10 px-2 py-2.5 w-full text-white text-lg font-medium">
            Sign In
          </button>
        </div>
      </form>
    </Form>
  );
}
