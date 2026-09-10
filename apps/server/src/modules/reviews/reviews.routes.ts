import { Router } from 'express';
const router = Router();
// TODO: implement reviews routes
router.get('/', (_req, res) => res.json({ success: true, message: 'reviews module placeholder', data: [] }));
export default router;
