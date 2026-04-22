import { Router } from 'express';
import ownerRoutes from './owner/owner.routes';
import spouseRoutes from './spouse/spouse.routes';
import childRoutes from './child/child.routes';
import otherDependantRoutes from './otherDependant/otherDependant.routes';
import domesticAndRelativeRoutes from './domesticAndRelative/domesticAndRelative.routes';
import otherStaffRoutes from './otherStaff/otherStaff.routes';

/**
 * Router principal pour le module Cards
 * Agrège toutes les routes des différents types de cartes diplomatiques
 */
const cardsRouter = Router();

// Routes Owner Cards (Titulaire)
cardsRouter.use('/owner', ownerRoutes);

// Routes Spouse Cards (Conjoint)
cardsRouter.use('/spouse', spouseRoutes);

// Routes Child Cards (Enfant)
cardsRouter.use('/child', childRoutes);

// Routes Other Dependant Cards (Autre personne à charge)
cardsRouter.use('/other-dependant', otherDependantRoutes);

// Routes Domestic and Relative Cards (Domestique et parent)
cardsRouter.use('/domestic-and-relative', domesticAndRelativeRoutes);

// Routes Other Staff Cards (Autre personnel)
cardsRouter.use('/other-staff', otherStaffRoutes);

export default cardsRouter;
