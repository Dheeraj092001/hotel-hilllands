import { Router } from 'express';
const router = Router();
// TODO: implement invoices routes
router.get('/', (_req, res) => res.json({ success: true, message: 'invoices module placeholder', data: [] }));
export default router;
