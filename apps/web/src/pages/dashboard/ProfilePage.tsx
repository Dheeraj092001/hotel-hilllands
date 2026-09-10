import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Calendar, MapPin, Award, CheckCircle, Save, Loader2 } from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";
import { useAuthStore } from "../../stores/authStore";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  pillowPreference: z.string().optional(),
  dietaryPreference: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { setUser, user: authUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["guestProfile"],
    queryFn: () => dashboardService.getProfile(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      const prefs = profile.preferences || {};
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "India",
        postalCode: profile.postalCode || "",
        pillowPreference: prefs.pillowPreference || "Feather",
        dietaryPreference: prefs.dietaryPreference || "None",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      const { pillowPreference, dietaryPreference, ...rest } = data;
      return dashboardService.updateProfile({
        ...rest,
        preferences: { pillowPreference, dietaryPreference },
      });
    },
    onSuccess: (updated) => {
      toast.success("Estate profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["guestProfile"] });
      if (authUser) {
        setUser({ ...authUser, name: updated.name });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#183C32]" />
      </div>
    );
  }

  const stats = profile?.stats || {
    totalBookings: 0,
    activeBookings: 0,
    completedStays: 0,
    reviewsCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Stats Banner */}
      <div className="bg-gradient-to-br from-[#183C32] to-[#315C4A] rounded-2xl p-6 md:p-8 text-[#F7F3EA] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D9C7A3] text-[#183C32] flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "G"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold">{profile?.name}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D9C7A3]/20 text-[#D9C7A3] px-2 py-0.5 rounded-full border border-[#D9C7A3]/30">
                  <Award className="w-3 h-3" /> Estate Member
                </span>
              </div>
              <p className="text-xs text-[#F7F3EA]/70 mt-1">{profile?.email}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/20 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-xl font-bold font-serif text-[#D9C7A3]">{stats.activeBookings}</p>
              <p className="text-[11px] text-[#F7F3EA]/70 uppercase tracking-wider">Active Stays</p>
            </div>
            <div className="bg-black/20 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-xl font-bold font-serif text-[#D9C7A3]">{stats.completedStays}</p>
              <p className="text-[11px] text-[#F7F3EA]/70 uppercase tracking-wider">Completed</p>
            </div>
            <div className="bg-black/20 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-xl font-bold font-serif text-[#D9C7A3]">{stats.reviewsCount}</p>
              <p className="text-[11px] text-[#F7F3EA]/70 uppercase tracking-wider">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#D9C7A3]/30 space-y-6">
        <div className="border-b border-[#D9C7A3]/30 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#183C32]">Personal Information & Sanctuary Preferences</h3>
          <p className="text-xs text-[#1C1C1A]/60 mt-1">Keep your details up to date so our estate concierge can personalize your arrival and in-room amenities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Full Legal Name *</label>
            <input {...register("name")} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
            {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Contact Phone</label>
            <input {...register("phone")} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Date of Birth</label>
            <input type="date" {...register("dateOfBirth")} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Street Address</label>
            <input {...register("address")} placeholder="Residence / Apartment" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">City</label>
            <input {...register("city")} placeholder="New Delhi, Mumbai, etc." className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">State / Region</label>
            <input {...register("state")} placeholder="Delhi, Maharashtra, etc." className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] focus:border-[#183C32]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Pillow Preference</label>
            <select {...register("pillowPreference")} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] bg-white">
              <option value="Feather">Goose Feather (Soft)</option>
              <option value="Memory Foam">Memory Foam (Contoured)</option>
              <option value="Buckwheat">Organic Buckwheat (Firm)</option>
              <option value="Hypoallergenic">Hypoallergenic Microfiber</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Dietary Preference</label>
            <select {...register("dietaryPreference")} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-sm focus:ring-1 focus:ring-[#183C32] bg-white">
              <option value="None">Standard / Non-Vegetarian</option>
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Vegan">Plant-Based / Vegan</option>
              <option value="Gluten-Free">Gluten-Free Conscious</option>
              <option value="Jain">Jain Friendly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#D9C7A3]/30">
          <button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D9C7A3]" />}
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
