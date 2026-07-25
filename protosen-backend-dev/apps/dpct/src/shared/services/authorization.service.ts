import { RoleEnum } from '@modules/user/types/user.types';
import { HttpStatusCode } from 'axios';
import { AUTH_MESSAGES } from 'src/constants';
import { ERROR_MESSAGE } from 'src/constants/messages';

/**
 * AuthorizationService - Service centralisé pour gérer toute la logique d'autorisation
 *
 * Ce service élimine la duplication du pattern switch-case qui apparaît 8+ fois
 * dans chaque contrôleur de carte.
 *
 * @example
 * // Avant (dans le contrôleur, répété 8 fois):
 * let card;
 * switch (userAuth.role) {
 *   case RoleEnum.USER:
 *     card = await service.getOne({ id, creatorId: userAuth.id, organismId: userAuth.organismId });
 *     break;
 *   case RoleEnum.ADMIN:
 *   case RoleEnum.SUPERADMIN:
 *     card = await service.getById(id);
 *     break;
 * }
 * if (!card) throw new Error('Not found');
 *
 * // Après (avec AuthorizationService):
 * const card = await authService.getAuthorizedResource(service, id, userAuth);
 */
export class AuthorizationService {
	/**
	 * Récupère une ressource en appliquant les règles d'autorisation selon le rôle
	 *
	 * @param service - Instance du service (ChildDCService, SpouseDCService, etc.)
	 * @param id - ID de la ressource
	 * @param userAuth - Utilisateur authentifié avec son rôle
	 * @returns La ressource si trouvée et autorisée
	 * @throws Error avec status 404 si la ressource n'existe pas ou n'est pas accessible
	 *
	 * @example
	 * const card = await authService.getAuthorizedResource(
	 *   new ChildDCService(),
	 *   cardId,
	 *   res.locals.userAuth
	 * );
	 */
	async getAuthorizedResource<T extends { getOne: (fields: object) => Promise<any>; getById: (id: string) => Promise<any> }>(
		service: T,
		id: string,
		userAuth: { id: string; organismId: string; role: RoleEnum },
	): Promise<NonNullable<Awaited<ReturnType<T['getById']>>>> {
		let resource: Awaited<ReturnType<T['getById']>>;

		switch (userAuth.role) {
			case RoleEnum.USER:
				// Les utilisateurs ne peuvent accéder qu'à leurs propres ressources
				resource = await service.getOne({
					id,
					creatorId: userAuth.id,
					organismId: userAuth.organismId,
				});
				break;

			case RoleEnum.ADMIN:
			case RoleEnum.SUPERADMIN:
				// Les admins et superadmins peuvent accéder à toutes les ressources
				resource = await service.getById(id);
				break;

			default:
				throw {
					status: HttpStatusCode.Forbidden,
					message: AUTH_MESSAGES.UNAUTHORIZED_ACCESS,
				};
		}

		if (!resource) {
			throw {
				status: HttpStatusCode.NotFound,
				message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
			};
		}

		return resource;
	}

	/**
	 * Vérifie si l'utilisateur a le droit de modifier une ressource
	 *
	 * @param userRole - Rôle de l'utilisateur
	 * @param resourceOwnerId - ID du propriétaire de la ressource
	 * @param userId - ID de l'utilisateur demandant l'accès
	 * @returns true si autorisé, false sinon
	 *
	 * @example
	 * if (!authService.canModify(userAuth.role, card.creatorId, userAuth.id)) {
	 *   throw { status: 403, message: 'Unauthorized' };
	 * }
	 */
	canModify(userRole: RoleEnum, resourceOwnerId: string, userId: string): boolean {
		// Les SUPERADMIN peuvent tout modifier
		if (userRole === RoleEnum.SUPERADMIN) {
			return true;
		}

		// Les ADMIN peuvent modifier les ressources de leur organisation
		if (userRole === RoleEnum.ADMIN) {
			return true;
		}

		// Les USER ne peuvent modifier que leurs propres ressources
		if (userRole === RoleEnum.USER) {
			return resourceOwnerId === userId;
		}

		return false;
	}

	/**
	 * Vérifie si l'utilisateur a le droit de supprimer une ressource
	 * Actuellement, seuls les SUPERADMIN peuvent supprimer
	 *
	 * @param userRole - Rôle de l'utilisateur
	 * @returns true si autorisé, false sinon
	 */
	canDelete(userRole: RoleEnum): boolean {
		return userRole === RoleEnum.SUPERADMIN;
	}

	/**
	 * Vérifie si l'utilisateur peut valider en tant qu'admin
	 *
	 * @param userRole - Rôle de l'utilisateur
	 * @returns true si ADMIN ou SUPERADMIN
	 */
	isAdminOrAbove(userRole: RoleEnum): boolean {
		return userRole === RoleEnum.ADMIN || userRole === RoleEnum.SUPERADMIN;
	}

	/**
	 * Vérifie si l'utilisateur est SUPERADMIN
	 *
	 * @param userRole - Rôle de l'utilisateur
	 * @returns true si SUPERADMIN
	 */
	isSuperAdmin(userRole: RoleEnum): boolean {
		return userRole === RoleEnum.SUPERADMIN;
	}
}

export default new AuthorizationService();
