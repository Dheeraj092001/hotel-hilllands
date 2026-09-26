import { useMutation } from "@tanstack/react-query";
import { enquiriesService } from "@/services/api/enquiries";
import type { EnquiryFormData } from "@/domain/enquiry/enquiry.types";

export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: (data: EnquiryFormData) => enquiriesService.submit(data),
  });
}