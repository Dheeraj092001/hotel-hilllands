import { Router } from 'express';
const router = Router();
// TODO: implement bookings routes
router.get('/', (_req, res) => res.json({ success: true, message: 'bookings module placeholder', data: [] }));
export default router;
