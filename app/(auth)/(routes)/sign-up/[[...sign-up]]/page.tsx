"use client";
import * as z from "zod";
import Image from "next/image"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Value } from "@radix-ui/react-select";
import { EyeIcon, EyeOffIcon } from "lucide-react";



const formSchema = z.object({
    name: z.string().min(2, {
        message: "School Name Required"
    }),
    country: z.string().min(2, {message:"Please select your country"}),
    district: z.string().min(2,{message:"Please select your district"}),
    subcounty: z.string().min(2, {message:"Please select your subcounty"}),
    parish: z.string().min(2, {message:"Please select your parish"}),
    email: z.string().email({
        message:"Invalid Email"
    }),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one digit").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8),
    terms: z.boolean().default(false).refine(Value => Value===true,"Agree to the Terms and Conditions before proceeding")
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ['confirmPassword']
        });
    }
});


export default function Page() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country:"",
            district:"",
            subcounty:"",
            parish:"",
            email:"",
            password:"",
            terms:false,
        },
    });


    const { isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/accounts", values);
            router.push(`/sign-in/${response.data.email}`);
            toast.success("School registered");
            console.log(values);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };


    // let districts: any[] = [];

    const countries = [
        {
            name: "Select Your Country",
            flag:"",
            districts: [
                {
                    name: "Select Your District",
                    subcounties: [
                        {
                            name: "Select Your Sub-County",
                            parishes: ["Select Your Parish"]
                        }
                    ]
                }
            ]
        },
        {
            name: "Uganda",
            flag: "/images/uga.png",
            districts: [
                {
                    name: "Kampala",
                    subcounties: [
                        {
                            name: "Central",
                            parishes: ["Busega", "Kabowa", "Kasubi"]
                        },
                    ]
                },
                {
                    name: "Wakiso",
                    subcounties: [
                        {
                            name: "Nsangi",
                            parishes: ["Kyengera","Kitemu","Katereke"]
                        },
                    ]
                },
                {
                    name: "Mpigi",
                    subcounties: [
                        {
                            name: "Buwama",
                            parishes: ["Bunjako","Bulunda","Sango"]
                        },
                    ]
                }
            ]
        },
        {
            name: "Kenya",
            flag: "/images/kenyan.png",
            districts: [
                {
                    name: "Mombasa",
                    subcounties: [
                        {
                            name: "Sub A",
                            parishes: ["Par A", "Par B", "Par C"]
                        },
                    ]
                },
                {
                    name: "Kwale",
                    subcounties: [
                        {
                            name: "Sub B",
                            parishes: ["Par D", "Par E", "Par F"]
                        },
                    ]
                },
                {
                    name: "Lamu",
                    subcounties: [
                        {
                            name: "Sub C",
                            parishes: ["Par G","Par H","Par I"]
                        },
                    ]
                }
            ]
        },
    ]

    const [districts, setDistricts] = useState(countries[0].districts);
    const [subcounties, setSubcounties] = useState(countries[0].districts[0].subcounties);
    const [parishes, setparishes] = useState(countries[0].districts[0].subcounties[0].parishes);
    const [showPassword, setShowPassword] = useState(false);

    const handDistrict = (country: string) =>{
        console.log(`Districts attached to ${country}`);
        countries.forEach(c => {
            if (c.name == country) {
                setDistricts(c.districts);
            }
        });
    }

    const handleCounties = (district: string) =>{
        districts.forEach(c => {
            if (c.name == district) {
                setSubcounties(c.subcounties);
            }
        });
    }

    const handleParishes = (sub: string) =>{
        subcounties.forEach(c => {
            if (c.name == sub) {
                setparishes(c.parishes);
            }
        });
    }

    return (
        <div className="flex flex-col place-items-center">
            <p className="text-2xl font-bold">Create an Account</p>
            <Form {...form}>
                            <form 
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-2 mt-8 min-w-full">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>School Name</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <Input 
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'Edify Primary and Nursery School'"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <p><FormLabel >School Location</FormLabel></p>
                                    <div className="flex w-full ">
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem className="flex-1 mr-1">
                                                    {/* <FormLabel>School Name</FormLabel> */}
                                                    <Select onValueChange={(value) => {field.onChange(value); handDistrict(value);}} defaultValue={field.value}>
                                                        <FormControl className="border-transparent focus:border-transparent focus:ring-0 rounded-r-none">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a country"  />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <FormMessage />
                                                        <SelectContent>
                                                            {countries.map((c) => {
                                                                return <SelectItem value={c.name} key={c.name}>
                                                                    <div className="flex pr-5 place-items-center">
                                                                        <Image
                                                                            className="h-3 me-2"
                                                                            src={c.flag}
                                                                            width={15}
                                                                            height={12}
                                                                            alt="flag"
                                                                            />
                                                                        {c.name}
                                                                    </div>
                                                                </SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}>

                                        </FormField>
                                        <FormField
                                            control={form.control}
                                            name="district"
                                            render={({ field }) => (
                                                <FormItem className = "flex-auto">
                                                    <Select onValueChange={(value) => {field.onChange(value); handleCounties(value);}} defaultValue={field.value}>
                                                        <FormControl className="border-transparent focus:border-transparent focus:ring-0 rounded-l-none">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a district" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <FormMessage />
                                                        <SelectContent>
                                                            {districts.map((d) => {
                                                                return <SelectItem value={d.name} key={d.name}>
                                                                    {d.name}
                                                                </SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}>

                                        </FormField>
                                    </div>
                                    <div className="flex w-full ">
                                        <FormField
                                            control={form.control}
                                            name="subcounty"
                                            render={({ field }) => (
                                                <FormItem className="flex-1 mr-1">
                                                    {/* <FormLabel>School Name</FormLabel> */}
                                                    <Select onValueChange={(value) => {field.onChange(value); handleParishes(value);}} defaultValue={field.value}>
                                                        <FormControl className="border-transparent focus:border-transparent focus:ring-0 rounded-r-none">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a subcounty"  />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <FormMessage />
                                                        <SelectContent>
                                                            {subcounties.map((c) => {
                                                                return <SelectItem value={c.name} key={c.name}>{c.name}</SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}>

                                        </FormField>
                                        <FormField
                                            control={form.control}
                                            name="parish"
                                            render={({ field }) => (
                                                <FormItem className = "flex-auto">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl className="border-transparent focus:border-transparent focus:ring-0 rounded-l-none">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a parish" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <FormMessage />
                                                        <SelectContent>
                                                            {parishes.map((d) => {
                                                                return <SelectItem value={d} key={d}>
                                                                    {d}
                                                                </SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}>

                                        </FormField>
                                    </div>
                                    {/* <p><FormLabel >Sign-In Details</FormLabel></p> */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Email Address</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <Input 
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'schoola@gmail.com'"
                                                    {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <div className="flex">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="flex-1 mr-1">
                                                <FormLabel>Account Password</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <div className="relative">
                                                        <Input 
                                                        type="password"
                                                        disabled={isSubmitting}
                                                        placeholder="Your Password"
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
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl className="border-transparent focus:border-transparent focus:ring-0">
                                                    <div className="relative">
                                                        <Input 
                                                        type="password"
                                                        disabled={isSubmitting}
                                                        placeholder="Confirm your password"
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
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row place-items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox 
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}/>
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        I Agree to Edify's Terms and Conditions of Usage
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <div className="flex place-items-center space-x-5">
                                        <Button type="submit" disabled={isSubmitting} className="mr-2">Sign Up</Button>
                                        <p className="py-5 text-gray-500 dark:text-gray-400 text-sm">Already have an account? <Link key="signup" href="/sign-in" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">Sign in to your account</Link> </p>
                                    </div>
                                    
                            </form>
                        </Form>
        </div>
    )
}