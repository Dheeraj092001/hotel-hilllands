import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe, Save, Search, Sparkles, FileText, Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function CmsPage() {
  const queryClient = useQueryClient();
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [heroTitle, setHeroTitle] = useState("Heritage Himalayan Retreat Above The Pines");
  const [heroSubtitle, setHeroSubtitle] = useState("Est. 1928 • Colonial Elegance, Pine-Scented Ridge Vistas & Fireside Luxury in Shimla");
  const [seoTitle, setSeoTitle] = useState("Hotel Newlands Shimla | Luxury Heritage Resort");
  const [seoDescription, setSeoDescription] = useState("Experience bespoke heritage hospitality at Hotel Newlands, nestled amidst deodar woods on Shimla's historic ridge.");

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["cmsPage", selectedSlug],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: any }>(`/cms/pages/${selectedSlug}`);
      return res.data.data;
    },
  });

  const saveHeroMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/cms/pages/${selectedSlug}/sections/hero`, {
        blockType: "HeroBlock",
        data: { title: heroTitle, subtitle: heroSubtitle },
      });
      await api.put(`/cms/pages/${selectedSlug}/seo`, {
        title: seoTitle,
        description: seoDescription,
      });
    },
    onSuccess: () => {
      toast.success("CMS content and SEO metadata published");
      queryClient.invalidateQueries({ queryKey: ["cmsPage", selectedSlug] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save CMS changes");
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Content Management System (CMS)</h2>
          <p className="text-xs text-stone-400 mt-0.5">Control public estate narratives, hero typography, and search engine index tags.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#12171C] p-1 rounded-xl border border-white/10">
          {["home", "about", "dining", "experiences", "offers"].map((slug) => (
            <button
              key={slug}
              onClick={() => setSelectedSlug(slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSlug === slug ? "bg-[#183C32] text-[#D9C7A3]" : "text-stone-400 hover:text-white"
              }`}
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
      ) : (
        <div className="space-y-6">
          {/* Hero Content Block */}
          <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9C7A3]" /> Primary Banner & Narrative ({selectedSlug.toUpperCase()})
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Headline Display Title</label>
                <input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white focus:ring-1 focus:ring-[#D9C7A3]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Estate Sub-Tagline</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white focus:ring-1 focus:ring-[#D9C7A3]"
                />
              </div>
            </div>
          </div>

          {/* SEO Metadata Editor */}
          <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D9C7A3]" /> Search Engine Optimization (SEO)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Browser Page Title Tag</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white focus:ring-1 focus:ring-[#D9C7A3]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Meta Description (SERP Snippet)</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white focus:ring-1 focus:ring-[#D9C7A3]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => saveHeroMutation.mutate()}
              disabled={saveHeroMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-semibold hover:bg-[#315C4A] border border-[#D9C7A3]/40 transition-colors shadow-sm disabled:opacity-50"
            >
              {saveHeroMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Live to Website</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
