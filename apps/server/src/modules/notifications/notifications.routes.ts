import { Router } from 'express';
const router = Router();
// TODO: implement notifications routes
router.get('/', (_req, res) => res.json({ success: true, message: 'notifications module placeholder', data: [] }));
export default router;
