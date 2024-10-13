"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { title } from "process";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";


interface TitleFormProps {
    initialData: {
    title: string;
    };
    courseId: string
};

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required',
    })
})

const TitleForm = ({
    initialData,
    courseId
}: TitleFormProps) => {

    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Training title
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? (
                        <>Cancel</>
                    ):(
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2"> {initialData.title}</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                    
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'Education Technology'"
                                    {...field}
                                        />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-2">
                            <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}>Save</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
     );
}
 
export default TitleForm;