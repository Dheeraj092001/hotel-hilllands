import { Router } from 'express';
const router = Router();
// TODO: implement analytics routes
router.get('/', (_req, res) => res.json({ success: true, message: 'analytics module placeholder', data: [] }));
export default router;
