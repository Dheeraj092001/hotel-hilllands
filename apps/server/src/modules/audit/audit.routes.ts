import { Router } from 'express';
const router = Router();
// TODO: implement audit routes
router.get('/', (_req, res) => res.json({ success: true, message: 'audit module placeholder', data: [] }));
export default router;
