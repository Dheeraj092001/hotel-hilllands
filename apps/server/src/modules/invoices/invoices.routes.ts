import { Router } from "express";
import { InvoicesController } from "./invoices.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/my-invoices", authenticate, InvoicesController.getMyInvoices);
router.get("/admin/all", authenticate, requireAdmin, InvoicesController.getAllInvoicesAdmin);
router.get("/:id", authenticate, InvoicesController.getInvoice);

export default router;
