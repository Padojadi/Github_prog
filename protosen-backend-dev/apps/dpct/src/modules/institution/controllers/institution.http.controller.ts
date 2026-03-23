import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { InstitutionsService } from '../services/institution.service';
import { GetInstitutionsInput } from '../dtos/institution.dto';

import {
	embassies,
	consultat,
	au,
	un,
	orgInternationale,
	bankAndFI,
	foundationsAndOng,
} from '../../../database/seeders/constant';
import { StrictStatusEnum } from '@shared/types';

class institutionController {
	async getInstitutions(req: Request<{}, {}, {}, GetInstitutionsInput>, res: Response) {
		try {
			const { status, search, page, limit, sort, code, institutionType } = req.query;

			const queryOptions = {
				status: status,
				search: search,
				page: page,
				limit: limit,
				sort: sort,
				institutionType: institutionType,
				code: code,
			};
			const institutions = await new InstitutionsService().getAll(queryOptions);
			return res.status(HttpStatusCode.Ok).json({
				data: institutions,
				message: 'successfully fetched instutions',
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}
	async create(req: Request, res: Response) {
		try {
			const institutions = [
				...embassies,
				...consultat,
				...au,
				...un,
				...orgInternationale,
				...bankAndFI,
				...foundationsAndOng,
			];

			const institutionService = new InstitutionsService();
			const results: any[] = [];

			for (const item of institutions) {
				try {
					const institution = await institutionService.save({
						institutionType: item.TypeOrganisme,
						code: item.Code,
						libelle: item.Libelle,
						service: item.Service ?? '',
						status: StrictStatusEnum.ACTIVE,
					});
					results.push(institution);
				} catch (error) {
					console.error(`Error creating institution ${item.Libelle}:`, error);
				}
			}

			return res.status(HttpStatusCode.Ok).json({
				data: results,
				message: 'successfully created institutions',
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async createInstitution(req: Request, res: Response) {
		try {
			const { institutionType, code, libelle, service, status } = req.body;

			const newInstitution = await new InstitutionsService().save({
				institutionType,
				code,
				libelle,
				service,
				status: status || StrictStatusEnum.ACTIVE,
			});

			return res.status(201).json(newInstitution);
		} catch  {
			return res.status(422).json({ error: "Erreur lors de la création de l'établissement." });
		}
	}

	async updateInstitution(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { institutionType, code, libelle, service, status } = req.body;

			const institution = await new InstitutionsService().getById(id);
			if (!institution) {
				return res.status(404).json({ error: 'Établissement non trouvé.' });
			}

			institution.institutionType = institutionType || institution.institutionType;
			institution.code = code || institution.code;
			institution.libelle = libelle || institution.libelle;
			institution.service = service || institution.service;
			institution.status = status || institution.status;

			await institution.save();

			return res.status(200).json(institution);
		} catch  {
			return res.status(422).json({ error: "Erreur lors de la mise à jour de l'institution." });
		}
	}

	async deleteInstitution(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const institution = await new InstitutionsService().getById(id);
			if (!institution) {
				return res.status(404).json({ error: 'Institution non trouvé.' });
			}

			await institution.destroy();

			return res.status(200).json(institution);
		} catch  {
			return res.status(422).json({ error: "Erreur lors de la suppression de l'institution." });
		}
	}
}

export default new institutionController();
