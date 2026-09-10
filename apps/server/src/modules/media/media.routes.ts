import { Router } from 'express';
const router = Router();
// TODO: implement media routes
router.get('/', (_req, res) => res.json({ success: true, message: 'media module placeholder', data: [] }));
export default router;
