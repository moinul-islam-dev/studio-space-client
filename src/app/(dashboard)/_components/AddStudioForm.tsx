"use client";

import {
  AlertCircleIcon,
  Building06Icon,
  Calendar03Icon,
  Cancel01Icon,
  Delete02Icon,
  DollarCircleIcon,
  Image01Icon,
  Layers01Icon,
  Loading03Icon,
  Location01Icon,
  PlusSignIcon,
  Tick02Icon,
  Upload04Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";


interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AvailableTimeRange {
  startTime: string;
  endTime: string;
}

interface StudioFormData {
  title: string;
  category: string;
  image: File | null;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  address: string;
  amenities: string[];
  overview: string;
  availableTimeRanges: AvailableTimeRange[];
}

interface AddStudioFormProps {
  user: User;
}

const initialFormData: StudioFormData = {
  title: "",
  category: "",
  image: null,
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  location: "",
  address: "",
  amenities: [],
  overview: "",
  availableTimeRanges: [
    {
      startTime: "",
      endTime: "",
    },
  ],
};

const STUDIO_CATEGORIES = [
  "Podcast Studio",
  "Video & Film Set",
  "Photography & Cyclorama",
  "Music & Audio Recording",
  "Live Streaming Suite",
  "Creative Multipurpose Loft",
];

const AMENITY_OPTIONS = [
  "High-Speed Wi-Fi",
  "Acoustic Treatment",
  "Studio Lighting Kit",
  "Broadcast Mics",
  "4K Camera Rig",
  "Air Conditioning",
  "Green Room / Makeup",
  "Free Parking",
  "Coffee & Lounge",
];

const AddStudioForm = ({ user }: AddStudioFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<StudioFormData>(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // image upload ---------------------------------------------------
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);



  useEffect(() => {
    if (!formData.image) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  // ----------------------------------------------------------------

  // Handle input changes
  const handleChange = (field: keyof StudioFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (file: File | null) => {
    setError("");

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or smaller.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Handle amenities
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((item) => item !== amenity),
    }));
  };

  // Handle available time range changes
  const handleTimeRangeChange = (
    index: number,
    field: keyof AvailableTimeRange,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availableTimeRanges: prev.availableTimeRanges.map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      ),
    }));
  };

  // Add time range
  const handleAddTimeRange = () => {
    setFormData((prev) => ({
      ...prev,
      availableTimeRanges: [
        ...prev.availableTimeRanges,
        {
          startTime: "",
          endTime: "",
        },
      ],
    }));
  };

  // Remove time range
  const handleRemoveTimeRange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availableTimeRanges: prev.availableTimeRanges.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.image) {
      return "Please select a studio image.";
    }

    if (!formData.title.trim()) {
      return "Studio title is required.";
    }

    if (!formData.category) {
      return "Please select a studio category.";
    }

    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
      return "Please enter a valid hourly rate.";
    }

    if (
      formData.securityDeposit === "" ||
      Number(formData.securityDeposit) < 0
    ) {
      return "Please enter a valid security deposit.";
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      return "Please enter a valid capacity.";
    }

    if (!formData.location.trim()) {
      return "Location is required.";
    }

    if (!formData.address.trim()) {
      return "Address is required.";
    }

    if (!formData.overview.trim()) {
      return "Studio overview is required.";
    }

    if (formData.availableTimeRanges.length === 0) {
      return "Please add at least one available time range.";
    }



    // Validate available time ranges -------------------------------------------------

    const ranges = formData.availableTimeRanges;

    if (ranges.length === 0) {
      return "Please add at least one available time range.";
    }

    const normalizedRanges = ranges.map((range) => ({
      start: range.startTime,
      end: range.endTime,
      startMinutes:
        Number(range.startTime.split(":")[0]) * 60 +
        Number(range.startTime.split(":")[1]),
      endMinutes:
        Number(range.endTime.split(":")[0]) * 60 +
        Number(range.endTime.split(":")[1]),
    }));

    for (const range of normalizedRanges) {
      if (!range.start || !range.end) {
        return "Please complete all available time ranges.";
      }

      if (range.startMinutes >= range.endMinutes) {
        return "End time must be later than start time.";
      }
    }

    const sortedRanges = [...normalizedRanges].sort(
      (a, b) => a.startMinutes - b.startMinutes
    );

    for (let i = 1; i < sortedRanges.length; i++) {
      if (
        sortedRanges[i].startMinutes <
        sortedRanges[i - 1].endMinutes
      ) {
        return "Available time ranges cannot overlap.";
      }
    }

    // ----------------------------------------------------------------------------------

    return "";
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const payload = new FormData();

      payload.append("image", formData.image!);
      payload.append("title", formData.title.trim());
      payload.append("category", formData.category);
      payload.append("hourlyRate", formData.hourlyRate);
      payload.append("securityDeposit", formData.securityDeposit);
      payload.append("capacity", formData.capacity);
      payload.append("location", formData.location.trim());
      payload.append("address", formData.address.trim());
      payload.append("amenities", JSON.stringify(formData.amenities));
      payload.append("overview", formData.overview.trim());
      payload.append(
        "availableTimeRanges",
        JSON.stringify(formData.availableTimeRanges)
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/add-studio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          body: payload,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create studio.");
      }

      toast.success(result.message);

    } 
    
    catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setError(message);
    } 
    
    finally {
      setLoading(false);
    }
  };

  const labelClasses = "gap-1 text-sm font-medium";
  const inputClasses = "h-11 bg-background px-3 dark:bg-background/60";
  const fieldGridClasses = "grid gap-4 @xs:grid-cols-2";

  return (
    <section
      className="@container w-full min-w-0 space-y-4 @2xl:space-y-5"
      aria-labelledby="add-studio-title"
    >
      <header className="flex flex-col gap-5 rounded-2xl border border-border bg-card bg-linear-to-br from-secondary/15 via-card to-primary/10 p-4 text-card-foreground @sm:p-6 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            <span
              aria-hidden="true"
              className="h-1 w-4 rounded-full bg-primary"
            />
            Studio listing
          </p>
          <h1
            id="add-studio-title"
            className="mt-2 text-2xl font-bold tracking-tight @sm:text-3xl"
          >
            Add New Studio
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Share the details guests need to find and book your space.
          </p>
        </div>

        <div className="flex w-fit max-w-full min-w-0 items-center gap-3 rounded-xl border border-border bg-card py-2 pr-4 pl-2 @2xl:max-w-64">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
            <HugeiconsIcon
              icon={UserCircle02Icon}
              size={19}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Hosting as</p>
            <p className="truncate text-sm font-semibold" title={user.name}>
              {user.name}
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="sticky top-2 z-10 flex items-center gap-3 rounded-xl border border-destructive/40 border-l-4 border-l-destructive bg-card py-1.5 pr-1.5 pl-3 text-sm text-card-foreground shadow-sm"
        >
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={19}
            aria-hidden="true"
            className="shrink-0 text-destructive"
          />
          <p className="min-w-0 flex-1 [overflow-wrap:anywhere]">{error}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="size-10 text-muted-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
          </Button>
        </div>
      )}

      <div className="grid gap-4 @2xl:gap-5 @4xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <StudioFormSection
          id="studio-details-title"
          icon={Building06Icon}
          title="Studio details"
          description="Give guests a name and a feel for the space."
        >
          <div className="space-y-2">
            <Label htmlFor="studio-title" className={labelClasses}>
              Studio title <RequiredMark />
            </Label>
            <Input
              id="studio-title"
              type="text"
              placeholder="e.g. Neon Acoustic Podcast Suite"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              aria-required="true"
              className={inputClasses}
            />
          </div>

          <div className="grid gap-4 @sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="studio-category" className={labelClasses}>
                Category <RequiredMark />
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  if (value !== null) {
                    handleChange("category", value);
                  }
                }}
              >
                <SelectTrigger
                  id="studio-category"
                  aria-required="true"
                  className={cn(
                    inputClasses,
                    "w-full min-w-0 pr-3 data-[size=default]:h-11",
                  )}
                >
                  <SelectValue
                    placeholder="Select a category"
                    className="min-w-0"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border">
                  {STUDIO_CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="min-h-9 rounded-md px-3 pr-8"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className={labelClasses}>
                Guest capacity <RequiredMark />
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                placeholder="6"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                aria-required="true"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-overview" className={labelClasses}>
              Overview <RequiredMark />
            </Label>
            <Textarea
              id="studio-overview"
              rows={4}
              placeholder="Describe the space, its setup, and what it's best suited for."
              value={formData.overview}
              onChange={(e) => handleChange("overview", e.target.value)}
              aria-required="true"
              className="min-h-24 resize-y bg-background px-3 py-2.5 dark:bg-background/60"
            />
          </div>
        </StudioFormSection>

        <StudioFormSection
          id="studio-cover-title"
          icon={Image01Icon}
          title="Cover image"
          description="Choose a photo that shows what guests can expect."
          required
        >
          <div className="flex flex-1 flex-col gap-2.5">
            <Label htmlFor="studio-image-upload" className="sr-only">
              Studio cover image
            </Label>
            <input
              ref={fileInputRef}
              id="studio-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-describedby="studio-image-rules"
              className={cn(
                "group relative flex min-h-44 w-full flex-1 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                previewUrl
                  ? "border-border bg-muted"
                  : "border-dashed border-muted-foreground/45 bg-background hover:border-muted-foreground hover:bg-muted/60",
              )}
            >
              {previewUrl ? (
                // biome-ignore lint/performance/noImgElement: This preview uses a local blob URL.
                <img
                  src={previewUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <HugeiconsIcon
                    icon={Upload04Icon}
                    size={20}
                    aria-hidden="true"
                  />
                </span>
              )}
              <span
                className={cn(
                  "rounded-md border border-border bg-card px-3 py-1.5 text-card-foreground shadow-xs group-hover:bg-accent group-hover:text-accent-foreground",
                  previewUrl && "absolute right-3 bottom-3",
                )}
              >
                {formData.image ? "Replace image" : "Choose an image"}
              </span>
            </button>

            {formData.image && (
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background py-0.5 pr-0.5 pl-3">
                <HugeiconsIcon
                  icon={Image01Icon}
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground"
                />
                <span
                  title={formData.image.name}
                  className="min-w-0 flex-1 truncate text-sm"
                >
                  {formData.image.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleImageChange(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  aria-label="Remove image"
                  className="size-10 text-muted-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
                </Button>
              </div>
            )}

            <p
              id="studio-image-rules"
              className="text-xs text-muted-foreground"
            >
              <span className="sr-only">Required. </span>
              JPG, PNG or WEBP · Up to 5 MB
            </p>
          </div>
        </StudioFormSection>

        <StudioFormSection
          id="studio-location-title"
          icon={Location01Icon}
          title="Location"
          description="Let guests know where to find the studio."
        >
          <div className={fieldGridClasses}>
            <div className="space-y-2">
              <Label htmlFor="studio-location" className={labelClasses}>
                Location <RequiredMark />
              </Label>
              <Input
                id="studio-location"
                type="text"
                placeholder="e.g. Gulshan, Dhaka"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                aria-required="true"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-address" className={labelClasses}>
                Street address <RequiredMark />
              </Label>
              <Input
                id="studio-address"
                type="text"
                placeholder="e.g. House 14, Road 7"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                aria-required="true"
                className={inputClasses}
              />
            </div>
          </div>
        </StudioFormSection>

        <StudioFormSection
          id="studio-pricing-title"
          icon={DollarCircleIcon}
          title="Pricing"
          description="Enter 0 for the security deposit if you don't charge one."
        >
          <div className={fieldGridClasses}>
            <div className="space-y-2">
              <Label htmlFor="hourly-rate" className={labelClasses}>
                Hourly rate <span className="sr-only">($)</span>
                <RequiredMark />
              </Label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                >
                  $
                </span>
                <Input
                  id="hourly-rate"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="50"
                  value={formData.hourlyRate}
                  onChange={(e) => handleChange("hourlyRate", e.target.value)}
                  aria-required="true"
                  className={cn(inputClasses, "pl-7")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security-deposit" className={labelClasses}>
                Security deposit <span className="sr-only">($)</span>
                <RequiredMark />
              </Label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                >
                  $
                </span>
                <Input
                  id="security-deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    handleChange("securityDeposit", e.target.value)
                  }
                  aria-required="true"
                  className={cn(inputClasses, "pl-7")}
                />
              </div>
            </div>
          </div>
        </StudioFormSection>

        <StudioFormSection
          id="studio-availability-title"
          icon={Calendar03Icon}
          title="Availability"
          description="Add at least one time slot guests can book."
          required
        >
          <div className="grid gap-3">
            {formData.availableTimeRanges.map((range, index) => (
              <div
                key={String(index)}
                className="grid items-end gap-2.5 not-first:border-t not-first:pt-3 @3xs:grid-cols-2 @md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem]"
              >
                <div className="min-w-0 space-y-2">
                  <Label
                    htmlFor={`slot-${index}-start`}
                    className={labelClasses}
                  >
                    Start time
                  </Label>
                  <Input
                    id={`slot-${index}-start`}
                    type="time"
                    aria-label={`Slot ${index + 1} start time`}
                    aria-required="true"
                    value={range.startTime}
                    onChange={(e) =>
                      handleTimeRangeChange(index, "startTime", e.target.value)
                    }
                    className={cn(
                      inputClasses,
                      !range.startTime && "text-muted-foreground",
                    )}
                  />
                </div>
                <div className="min-w-0 space-y-2">
                  <Label htmlFor={`slot-${index}-end`} className={labelClasses}>
                    End time
                  </Label>
                  <Input
                    id={`slot-${index}-end`}
                    type="time"
                    aria-label={`Slot ${index + 1} end time`}
                    aria-required="true"
                    value={range.endTime}
                    onChange={(e) =>
                      handleTimeRangeChange(index, "endTime", e.target.value)
                    }
                    className={cn(
                      inputClasses,
                      !range.endTime && "text-muted-foreground",
                    )}
                  />
                </div>

                {index === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTimeRange}
                    aria-label="Add time slot"
                    className="col-span-full h-11 w-full gap-1.5 px-2 @md:col-span-1"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} aria-hidden="true" />
                    Add time slot
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveTimeRange(index)}
                    aria-label="Remove time slot"
                    className="col-span-full h-11 w-full gap-1.5 px-2 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-foreground @md:col-span-1"
                  >
                    <HugeiconsIcon icon={Delete02Icon} aria-hidden="true" />
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </StudioFormSection>

        <StudioFormSection
          id="studio-amenities-title"
          icon={Layers01Icon}
          title="Amenities"
          description="Select everything that's included in a booking."
        >
          <div className="grid gap-2 @3xs:grid-cols-2 @lg:grid-cols-3">
            {AMENITY_OPTIONS.map((amenity) => {
              const isChecked = formData.amenities.includes(amenity);
              const checkboxId = `amenity-${amenity
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`;

              return (
                <label
                  key={amenity}
                  htmlFor={checkboxId}
                  className={cn(
                    "flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                    isChecked
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-input bg-background text-foreground hover:bg-muted",
                  )}
                >
                  <Checkbox
                    id={checkboxId}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleAmenityChange(amenity, checked === true)
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-sm border",
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/50",
                    )}
                  >
                    {isChecked && <HugeiconsIcon icon={Tick02Icon} size={12} />}
                  </span>
                  <span>{amenity}</span>
                </label>
              );
            })}
          </div>
        </StudioFormSection>
      </div>

      <footer className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground @sm:flex-row @sm:items-center @sm:justify-between @sm:px-5">
        <p className="text-sm text-muted-foreground">
          Fields marked{" "}
          <span className="font-semibold text-destructive">*</span> are
          required.
        </p>
        <Button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="h-11 w-full cursor-pointer gap-2 px-5 font-semibold @sm:w-auto"
        >
          {loading ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
              <span>Adding Studio...</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={PlusSignIcon} aria-hidden="true" />
              <span>Add Studio</span>
            </>
          )}
        </Button>
      </footer>
    </section>
  );
};

function StudioFormSection({
  id,
  icon,
  title,
  description,
  required,
  children,
}: {
  id: string;
  icon: IconSvgElement;
  title: string;
  description: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex min-w-0 flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-xs"
    >
      <header className="flex items-start gap-3 border-b border-border p-4 @sm:px-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <HugeiconsIcon icon={icon} size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={id} className="font-semibold tracking-tight">
            {title}
            {required && (
              <span className="ml-1">
                <RequiredMark />
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </div>
      </header>
      <div className="@container flex flex-1 flex-col gap-4 p-4 @sm:p-5">
        {children}
      </div>
    </section>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive">
      *
    </span>
  );
}

export default AddStudioForm;
