import { Router } from 'express';
const router = Router();
// TODO: implement rooms routes
router.get('/', (_req, res) => res.json({ success: true, message: 'rooms module placeholder', data: [] }));
export default router;
