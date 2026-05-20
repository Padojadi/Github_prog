import express from 'express';
import authRouter from '../modules/auth';
import userRouter from '../modules/user';
import cardsRouter from '../modules/cards';
import institutionRouter from '../modules/institution';
import statisticsRouter from '../modules/statistics';
import cardTypeRouter from '../modules/cardType';
import plaqueRouter from '../modules/plaque';
import accessgroupRouter from '../modules/accessgroup';
import systemSettingsRouter from '../modules/systemSettings';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/card', cardsRouter);
router.use('/institution', institutionRouter);
router.use('/stats', statisticsRouter);
router.use('/card-types', cardTypeRouter);
router.use('/plaque', plaqueRouter);
router.use('/accessgroup', accessgroupRouter);
router.use('/system-settings', systemSettingsRouter);

export default router;
