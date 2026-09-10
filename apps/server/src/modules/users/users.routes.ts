import { Router } from 'express';
const router = Router();
// TODO: implement users routes
router.get('/', (_req, res) => res.json({ success: true, message: 'users module placeholder', data: [] }));
export default router;
