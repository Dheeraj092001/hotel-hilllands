import { Router } from "express";
import { InvoicesController } from "./invoices.controller";
import { authenticate } from "../../middleware/authenticate";

const router: Router = Router();

router.get("/my-invoices", authenticate, InvoicesController.getMyInvoices);
router.get("/:id", authenticate, InvoicesController.getInvoice);

export default router;
