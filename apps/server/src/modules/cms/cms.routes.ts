import { Router } from 'express';
const router = Router();
// TODO: implement cms routes
router.get('/', (_req, res) => res.json({ success: true, message: 'cms module placeholder', data: [] }));
export default router;
