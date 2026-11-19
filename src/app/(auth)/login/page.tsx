"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowRight,
    CalendarCheck2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineError } from "react-icons/md";
import { toast } from "react-hot-toast";

import { signIn, signInSocial } from "@/lib/actions/auth-actions";
import studioLogo from "@/assets/logo.svg"; // Adjust extension (.png / .svg) to match your assets folder
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

const SignInPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        error: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSocialAuth = async (provider: "google") => {
        setIsLoading(true);
        handleChange("error", "");

        try {
            const { success, url } = await signInSocial(provider);

            if (!success || !url) {
                throw new Error(
                    `Unable to sign in with ${provider}. Please try again.`
                );
            }

            window.location.assign(url);
            toast.success("Signed in successfully!");
        } catch (err) {
            handleChange(
                "error",
                `Authentication error: ${err instanceof Error ? err.message : "Unknown error"}`
            );
            toast.error("Sign in failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleChange("error", "");
        setIsLoading(true);

        try {
            const { email, password } = formData;
            const res = await signIn({ email, password });

            if (!res?.user) {
                handleChange("error", "Invalid email or password");
                toast.error(error);
                return;
            }

            toast.success("Signed in successfully!");
            router.replace("/");
            router.refresh();
        } catch (err) {
            handleChange(
                "error",
                `Authentication error: ${err instanceof Error ? err.message : "Unknown error"}`
            );
            toast.error("Sign in failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const { email, password, error } = formData;

    return (
        <main className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Left Editorial Column (Inspired by Reference Layout) */}
                <section className="hidden space-y-8 lg:col-span-6 lg:block">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>StudioSpace Workspace</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground xl:text-5xl">
                            One place where studio bookings get confirmed.
                        </h1>
                        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                            Manage your creative spaces, lock production dates, and keep every
                            session trail organized in one workspace.
                        </p>
                    </div>

                    {/* Feature Highlights matching Reference Icon Badges */}
                    <div className="space-y-5 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <CalendarCheck2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    Instant slot confirmation
                                </h2>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Lock hourly or full-day studio shoots without back-and-forth
                                    threads.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    Verified studio listings
                                </h2>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Every space includes gear specs, lighting setups, and clear
                                    pricing.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-foreground">
                                    Built for creators &amp; hosts
                                </h2>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Switch seamlessly between booking studios and managing your
                                    listings.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Sign-In Card */}
                <section className="mx-auto w-full max-w-[440px] lg:col-span-6">
                    <Card className="overflow-hidden rounded-3xl border-border bg-card p-0 shadow-xl">
                        {/* Top Brand Gradient Header */}
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
                                    Member Access
                                </span>
                            </div>

                            <div className="pt-4">
                                <CardTitle className="text-2xl font-extrabold tracking-[-0.025em] text-[#0E0E10]">
                                    Welcome back
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs font-medium text-[#0E0E10]/75">
                                    Sign in to continue to your StudioSpace account
                                </CardDescription>
                            </div>
                        </CardHeader>

                        {/* Form Body */}
                        <CardContent className="p-6 sm:p-8">
                            {error && (
                                <div
                                    role="alert"
                                    aria-live="polite"
                                    className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
                                >
                                    <MdOutlineError
                                        aria-hidden="true"
                                        className="shrink-0 text-base"
                                    />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form
                                onSubmit={handleEmailAuth}
                                className="flex w-full flex-col gap-4"
                            >
                                {/* Email Address */}
                                <div className="flex w-full flex-col gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-semibold text-foreground"
                                    >
                                        Email address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@studio.com"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleChange("email", e.target.value)
                                            }
                                            autoComplete="email"
                                            required
                                            className="h-11 w-full rounded-xl border-input bg-background/60 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="flex w-full flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-semibold text-foreground"
                                        >
                                            Password
                                        </Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Your password"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleChange("password", e.target.value)
                                            }
                                            autoComplete="current-password"
                                            minLength={8}
                                            required
                                            className="h-11 w-full rounded-xl border-input bg-background/60 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={
                                                showPassword ? "Hide password" : "Show password"
                                            }
                                            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Primary Pill CTA Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-2 h-12 w-full rounded-full bg-primary text-[14px] font-semibold text-primary-foreground shadow-none transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(198,242,78,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoading ? (
                                        "Signing in..."
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Sign in
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6 flex items-center">
                                <Separator className="flex-1 bg-border" />
                                <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                    or continue with
                                </span>
                                <Separator className="flex-1 bg-border" />
                            </div>

                            {/* Google Auth Pill Button */}
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => handleSocialAuth("google")}
                                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border-border bg-background/50 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                <FcGoogle className="text-lg" />
                                <span>Continue with Google</span>
                            </Button>

                            {/* Footer Switch Link */}
                            <p className="mt-6 text-center text-xs text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-foreground/80 dark:text-primary"
                                >
                                    Register free
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    );
};

export default SignInPage;