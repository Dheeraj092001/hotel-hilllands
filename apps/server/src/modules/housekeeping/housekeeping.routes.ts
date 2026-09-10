import { Router } from 'express';
const router = Router();
// TODO: implement housekeeping routes
router.get('/', (_req, res) => res.json({ success: true, message: 'housekeeping module placeholder', data: [] }));
export default router;
