import { Router } from 'express';
const router = Router();
// TODO: implement offers routes
router.get('/', (_req, res) => res.json({ success: true, message: 'offers module placeholder', data: [] }));
export default router;
