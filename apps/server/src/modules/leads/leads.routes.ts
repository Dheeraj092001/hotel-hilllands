import { Router } from 'express';
const router = Router();
// TODO: implement leads routes
router.get('/', (_req, res) => res.json({ success: true, message: 'leads module placeholder', data: [] }));
export default router;
