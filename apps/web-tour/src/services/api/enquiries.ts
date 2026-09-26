import { apiClient } from "./client";
import type { EnquiryFormData } from "@/domain/enquiry/enquiry.types";

export const enquiriesService = {
  /** Submit an enquiry / lead */
  submit: async (payload: EnquiryFormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post("/leads", payload);
    return data;
  },
};