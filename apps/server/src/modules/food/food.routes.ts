import { Router } from 'express';
const router = Router();
// TODO: implement food routes
router.get('/', (_req, res) => res.json({ success: true, message: 'food module placeholder', data: [] }));
export default router;
