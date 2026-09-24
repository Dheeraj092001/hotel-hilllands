import { Router } from "express";
import { InvoicesController } from "./invoices.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/my-invoices", authenticate, InvoicesController.getMyInvoices);
router.get("/admin/all", authenticate, requireAdmin, InvoicesController.getAllInvoicesAdmin);
router.get("/admin/guest-lookup", authenticate, requireAdmin, InvoicesController.lookupGuestByEmail);
router.get("/admin/checkout-preview/:bookingId", authenticate, requireAdmin, InvoicesController.getCheckoutPreview);
router.post("/admin/generate-checkout", authenticate, requireAdmin, InvoicesController.generateCheckoutInvoice);
router.post("/admin/:id/send-email", authenticate, requireAdmin, InvoicesController.sendInvoiceEmail);
router.get("/:id", authenticate, InvoicesController.getInvoice);

export default router;
