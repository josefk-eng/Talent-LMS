"use client";

// import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";


const formSchema = z.object({
    email: z.string().email({
        message:"Invalid Email"
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),

});

export default function Page() {

    const params = useParams();
    const router = useRouter();

    console.log(params);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email:"",
            password:""
        }
    });

    const { isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const user = await axios.post("/api/accounts/login", values);

            if (!user) {
                toast.error("No Account with the mentioned email")
            }else if (user.data.password !== values.password) {
                toast.error("Invalid Password");
            }else{
                sessionStorage.setItem("id",user.data.id);
                router.push("/");
                toast.success("Logged In Successfully");

            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    };

    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="flex flex-col place-items-center">
            <p className="text-2xl font-bold">Log In</p>
            <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-2 mt-8 min-w-full"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Email Address</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <Input 
                                                    // disabled={isSubmitting}
                                                    placeholder="e.g. 'edify@gmail.com'"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="flex-1 mr-1 mt-5">
                                                <FormLabel>Enter Password</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <div className="relative">
                                                        <Input 
                                                        type="password"
                                                        // disabled={isSubmitting}
                                                        placeholder="Enter Your Password"
                                                        {...field}
                                                        />
                                                        <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                // disabled={disabled}
                                                            >
                                                            {showPassword ? (
                                                                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                                            ) : (
                                                                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                                            )}
                                                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <div className="flex place-items-center space-x-5">
                                        <Button type="submit" disabled={isSubmitting} className="mr-2">Sign In</Button>
                                        <p className="py-5 text-gray-500 dark:text-gray-400 text-sm">Just Got Here? <Link key="signin" href="/sign-up" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">Create an account</Link> </p>
                                    </div>
                            </form>
                        </Form>
        </div>
    )
}