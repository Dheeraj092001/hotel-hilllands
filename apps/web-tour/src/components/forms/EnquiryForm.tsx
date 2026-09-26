import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSubmitEnquiry } from "@/hooks/useEnquiry";
import type { EnquiryFormData } from "@/domain/enquiry/enquiry.types";

const enquirySchema = z.object({
  name:           z.string().min(2, "Name must be at least 2 characters"),
  email:          z.string().email("Please enter a valid email"),
  phone:          z.string().min(10, "Please enter a valid phone number"),
  subject:        z.string().min(5, "Please describe your enquiry"),
  message:        z.string().min(20, "Please provide more detail (min 20 chars)"),
  travelDate:     z.string().optional(),
  numberOfGuests: z.coerce.number().int().min(1).max(50).optional(),
  destination:    z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  tourId?: string;
  prefilledDestination?: string;
  onSuccess?: () => void;
}

export function EnquiryForm({ tourId, prefilledDestination, onSuccess }: EnquiryFormProps) {
  const { mutate, isPending } = useSubmitEnquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { destination: prefilledDestination },
  });

  const onSubmit = (values: EnquiryFormValues) => {
    const payload: EnquiryFormData = { ...values, tourId, source: "WEBSITE" };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Enquiry sent! We will contact you within 24 hours.");
        reset();
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const inputClass = "w-full rounded-brand border border-stone/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-stone/60 focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine transition-colors";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Tour enquiry form"
      className="grid gap-4 sm:grid-cols-2"
    >
      {/* Name */}
      <div>
        <label htmlFor="enquiry-name" className="mb-1 block text-xs font-medium text-stone">Full Name *</label>
        <input id="enquiry-name" type="text" autoComplete="name" placeholder="Jane Doe" className={inputClass} {...register("name")} />
        {errors.name && <p className={errorClass} role="alert">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="enquiry-email" className="mb-1 block text-xs font-medium text-stone">Email *</label>
        <input id="enquiry-email" type="email" autoComplete="email" placeholder="jane@example.com" className={inputClass} {...register("email")} />
        {errors.email && <p className={errorClass} role="alert">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="enquiry-phone" className="mb-1 block text-xs font-medium text-stone">Phone *</label>
        <input id="enquiry-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={inputClass} {...register("phone")} />
        {errors.phone && <p className={errorClass} role="alert">{errors.phone.message}</p>}
      </div>

      {/* Travel date */}
      <div>
        <label htmlFor="enquiry-date" className="mb-1 block text-xs font-medium text-stone">Preferred Travel Date</label>
        <input id="enquiry-date" type="date" min={new Date().toISOString().split("T")[0]} className={inputClass} {...register("travelDate")} />
      </div>

      {/* Destination */}
      <div>
        <label htmlFor="enquiry-destination" className="mb-1 block text-xs font-medium text-stone">Destination / Tour</label>
        <input id="enquiry-destination" type="text" placeholder="Spiti Valley, Kinnaur..." className={inputClass} {...register("destination")} />
      </div>

      {/* Group size */}
      <div>
        <label htmlFor="enquiry-guests" className="mb-1 block text-xs font-medium text-stone">Number of Guests</label>
        <input id="enquiry-guests" type="number" min={1} max={50} placeholder="2" className={inputClass} {...register("numberOfGuests")} />
        {errors.numberOfGuests && <p className={errorClass} role="alert">{errors.numberOfGuests.message}</p>}
      </div>

      {/* Subject — full width */}
      <div className="sm:col-span-2">
        <label htmlFor="enquiry-subject" className="mb-1 block text-xs font-medium text-stone">Subject *</label>
        <input id="enquiry-subject" type="text" placeholder="e.g., 7-day Spiti Valley Trek enquiry" className={inputClass} {...register("subject")} />
        {errors.subject && <p className={errorClass} role="alert">{errors.subject.message}</p>}
      </div>

      {/* Message — full width */}
      <div className="sm:col-span-2">
        <label htmlFor="enquiry-message" className="mb-1 block text-xs font-medium text-stone">Message *</label>
        <textarea
          id="enquiry-message"
          rows={4}
          placeholder="Tell us your travel dates, group size, budget, and any special requirements..."
          className={`${inputClass} resize-none`}
          {...register("message")}
        />
        {errors.message && <p className={errorClass} role="alert">{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" isLoading={isPending} className="w-full sm:w-auto">
          <Send size={16} />
          {isPending ? "Sending..." : "Send Enquiry"}
        </Button>
        <p className="mt-3 text-xs text-stone">We respond within 24 hours. Your information is kept private.</p>
      </div>
    </form>
  );
}