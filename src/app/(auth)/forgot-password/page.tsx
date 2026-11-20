
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Aperture,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    KeyRound,
    Mail,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";
import { MdOutlineError } from "react-icons/md";
import { toast } from "react-hot-toast";

import { requestPasswordReset } from "@/lib/actions/auth-actions";
import studioLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        error: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            email: e.target.value,
            error: "",
        }));
    };

    // Handle password reset request
    const handleResetRequest = async (
        e?: React.FormEvent<HTMLFormElement>
    ) => {
        if (e) e.preventDefault();

        const email = formData.email.trim();

        if (!email) {
            setFormData((prev) => ({
                ...prev,
                error: "Please enter your email address.",
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            error: "",
        }));

        setIsLoading(true);

        try {
            const result = await requestPasswordReset(email);

            if (!result.success) {
                throw new Error(result.message);
            }

            setIsSubmitted(true);
            toast.success(result.message);

        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";

            setFormData((prev) => ({
                ...prev,
                error: message,
            }));

            toast.error("Failed to send reset link.");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">

                {/* Left Editorial Column */}
                <section className="hidden space-y-8 lg:col-span-6 lg:block">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>Account Recovery</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground xl:text-5xl">
                            Locked out? Let&apos;s get you back in.
                        </h1>

                        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                            Enter the email linked to your StudioSpace account and we&apos;ll
                            send a secure, time-limited link to reset your password.
                        </p>
                    </div>

                    {/* Recovery Steps */}
                    <div className="space-y-5 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <Mail className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    1. Request a reset link
                                </h2>

                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Submit your registered email address to trigger an instant
                                    recovery email.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <KeyRound className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    2. Set a new password
                                </h2>

                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Open the verification link from your inbox and choose a fresh
                                    password.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ShieldAlert className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    Protected by single-use tokens
                                </h2>

                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Reset links expire automatically to keep your studio listings
                                    and bookings safe.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Forgot Password Card */}
                <section className="mx-auto w-full max-w-[440px] lg:col-span-6">
                    <Card className="overflow-hidden rounded-3xl border-border bg-card p-0 shadow-xl">

                        {/* Top Brand Header */}
                        <CardHeader className="bg-brand-gradient px-6 py-7 text-[#0E0E10] sm:px-8">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#0E0E10] px-3.5 py-1.5 text-xs font-extrabold tracking-tight text-white transition-transform hover:scale-[1.02]"
                                >
                                    {studioLogo ? (
                                        <Image
                                            src={studioLogo}
                                            alt="StudioSpace Logo"
                                            width={18}
                                            height={18}
                                            className="h-4 w-4 object-contain"
                                        />
                                    ) : (
                                        <Aperture className="h-4 w-4 text-[#C6F24E]" />
                                    )}

                                    <span>
                                        Studio<span className="text-[#C6F24E]">Space</span>
                                    </span>
                                </Link>

                                <span className="rounded-full bg-[#0E0E10]/10 px-3 py-1 text-[11px] font-semibold text-[#0E0E10]">
                                    Security
                                </span>
                            </div>

                            <div className="pt-4">
                                <CardTitle className="text-2xl font-extrabold tracking-[-0.025em] text-[#0E0E10]">
                                    {isSubmitted ? "Check your inbox" : "Reset password"}
                                </CardTitle>

                                <CardDescription className="mt-1 text-xs font-medium text-[#0E0E10]/75">
                                    {isSubmitted
                                        ? "We sent password recovery instructions to your email"
                                        : "Enter your email address to receive a password reset link"}
                                </CardDescription>
                            </div>
                        </CardHeader>

                        {/* Card Body */}
                        <CardContent className="p-6 sm:p-8">

                            {/* Error Message */}
                            {formData.error && (
                                <div
                                    role="alert"
                                    aria-live="polite"
                                    className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
                                >
                                    <MdOutlineError
                                        aria-hidden="true"
                                        className="shrink-0 text-base"
                                    />

                                    <span>{formData.error}</span>
                                </div>
                            )}

                            {isSubmitted ? (

                                /* Submitted Confirmation State */
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-foreground">
                                                    Reset link dispatched
                                                </p>

                                                <p className="text-xs leading-relaxed text-muted-foreground">
                                                    If an account exists for{" "}
                                                    <span className="font-semibold text-foreground">
                                                        {formData.email}
                                                    </span>
                                                    , you will receive an email with a link to create a
                                                    new password shortly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resend Reset Email */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isLoading}
                                        onClick={() => handleResetRequest()}
                                        className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-border bg-background/50 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                                        />

                                        <span>
                                            {isLoading
                                                ? "Resending link..."
                                                : "Resend reset email"}
                                        </span>
                                    </Button>

                                    {/* Change Email */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSubmitted(false);

                                            setFormData((prev) => ({
                                                ...prev,
                                                error: "",
                                            }));
                                        }}
                                        className="w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Use a different email address
                                    </button>
                                </div>

                            ) : (

                                /* Email Input Form State */
                                <form
                                    onSubmit={handleResetRequest}
                                    className="flex w-full flex-col gap-4"
                                >
                                    <div className="flex w-full flex-col gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-foreground"
                                        >
                                            Registered email address
                                        </Label>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="you@studio.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                                required
                                                className="h-11 w-full rounded-xl border-input bg-background/60 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Primary CTA Button */}
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.email.trim()}
                                        className="mt-2 h-12 w-full rounded-full bg-primary text-[14px] font-semibold text-primary-foreground shadow-none transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(198,242,78,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            "Sending reset link..."
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Send reset link
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Divider */}
                            <div className="relative my-6 flex items-center">
                                <Separator className="flex-1 bg-border" />

                                <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                    remembered it?
                                </span>

                                <Separator className="flex-1 bg-border" />
                            </div>

                            {/* Back to Login */}
                            <Button
                                variant="outline"
                                className="h-11 w-full rounded-full border-border bg-background/50 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back to sign in</span>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;
