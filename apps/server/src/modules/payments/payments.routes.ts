import { Router } from 'express';
const router = Router();
// TODO: implement payments routes
router.get('/', (_req, res) => res.json({ success: true, message: 'payments module placeholder', data: [] }));
export default router;
