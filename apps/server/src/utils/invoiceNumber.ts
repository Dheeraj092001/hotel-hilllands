import { prisma } from "../lib/prisma";
import { env } from "../config/env";

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = env.invoicePrefix;

  // Atomic counter using transaction
  const result = await prisma.$transaction(async (tx) => {
    const setting = await tx.systemSetting.upsert({
      where: { key: `invoice_counter_${year}` },
      update: { value: { increment: 1 } as any },
      create: {
        key: `invoice_counter_${year}`,
        value: JSON.stringify(1),
        description: `Invoice counter for year ${year}`,
      },
    });
    return setting;
  });

  const counter = parseInt(String(result.value));
  return `${prefix}/${year}/${String(counter).padStart(6, "0")}`;
}

export function generateConfirmationNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "NLS-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
