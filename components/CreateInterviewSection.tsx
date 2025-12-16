"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // ADDED
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";

// --- Form Logic (InterviewFormBody remains the same) ---

const InterviewFormSchema = z.object({
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  type: z
    .string()
    .refine((val) => ["technical", "behavioral", "mixed"].includes(val.toLowerCase()), {
      message: "Type must be 'Technical', 'Behavioral', or 'Mixed'.",
    }),
  level: z
    .string()
    .refine((val) => ["junior", "mid", "senior"].includes(val.toLowerCase()), {
      message: "Level must be 'Junior', 'Mid', or 'Senior'.",
    }),
  techstack: z
    .string()
    .min(2, { message: "Tech stack must be at least 2 characters." }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number." })
    .min(1, { message: "Amount must be at least 1." })
    .max(20, { message: "Amount must be at most 20." }),
});

type InterviewFormInput = z.infer<typeof InterviewFormSchema>;

const InterviewFormBody = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
    const router = useRouter();

    const form = useForm<InterviewFormInput>({
        resolver: zodResolver(InterviewFormSchema),
        defaultValues: {
            role: "",
            type: "Mixed",
            level: "Junior",
            techstack: "",
            amount: 5 as number,
        },
    });

    const onSubmit = async (data: InterviewFormInput) => {
        try {
            const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    userid: userId, // The fixed logged-in user ID
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate interview.");
            }

            toast.success("Interview created and scheduled successfully! Redirecting...");
            router.push("/");
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "An unexpected error occurred during submission.");
        }
    };
    
    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6 py-10 px-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Create Interview</h3>
                <Button variant="ghost" size="sm" onClick={onClose} className="!p-0 !h-auto text-primary-200">
                    Close
                </Button>
            </div>
            <p className="text-sm text-light-100/80">
                Define the parameters for your mock interview.
            </p>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 form"
                >
                    <FormField
                        control={form.control}
                        name="role"
                        label="Role (e.g., Frontend Developer)"
                        placeholder="Your desired role"
                        type="text"
                    />
                    <FormField
                        control={form.control}
                        name="level"
                        label="Level (Junior, Mid, or Senior)"
                        placeholder="e.g., Junior"
                        type="text"
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        label="Type (Technical, Behavioral, or Mixed)"
                        placeholder="e.g., Mixed"
                        type="text"
                    />
                    <FormField
                        control={form.control}
                        name="techstack"
                        label="Tech Stack (Comma-separated)"
                        placeholder="e.g., React, Next.js, Tailwind CSS"
                        type="text"
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        label="Number of Questions (Max 20)"
                        placeholder="e.g., 5"
                        type="text"
                    />

                    <Button className="btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Interview"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
// --- End Form Logic ---

const CreateInterviewSection = ({ userId }: { userId: string }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    if (isFormOpen) {
        return (
            <div className="card-border w-full">
                <InterviewFormBody userId={userId} onClose={() => setIsFormOpen(false)} />
            </div>
        );
    }

    return (
        <div className="card-cta">
            <div className="flex flex-col gap-6 max-w-lg">
                <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                <p className="text-lg">
                    Practice real interview questions & get instant feedback
                </p>

                <div className="flex gap-4 max-sm:flex-col"> {/* Container for both buttons */}
                    {/* 1. "Start an Interview" button (Restored) */}
                    <Link href="/interview">
                        <Button className="btn-primary max-sm:w-full">
                            Start an Interview
                        </Button>
                    </Link>

                    {/* 2. "Create a New Interview" button (Toggles the form) */}
                    <Button 
                        variant="secondary" // Use secondary for visual distinction
                        className="max-sm:w-full"
                        onClick={() => setIsFormOpen(true)}
                    >
                        Create a New Interview
                    </Button>
                </div>
            </div>

            <Image
                src="/robot.png"
                alt="robo-dude"
                width={400}
                height={400}
                className="max-sm:hidden"
            />
        </div>
    );
};

export default CreateInterviewSection;