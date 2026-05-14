import { OrganismeServiceServer, Organisme, OrganismeList } from '@grpc/generated/organisme';
import { InstitutionsService } from '../services/institution.service';
import * as grpc from '@grpc/grpc-js';
import { Institution as InstitutionModel } from 'database/models';

/**
 * Mapping Sequelize Institution model to Protobuf Organisme message
 */
function mapInstitutionToProto(institution: InstitutionModel): Organisme {
	return Organisme.create({
		id: institution.id.toString(),
		institutionType: institution.institutionType,
		code: institution.code,
		libelle: institution.libelle,
		service: institution.service,
		status: institution.status,
	});
}

/**
 * gRPC Controller for Organisme (Institution) Service
 * Implements OrganismeServiceServer interface from generated proto
 */
export class InstitutionGrpcController implements OrganismeServiceServer {
	[method: string]: any;
	private institutionService = new InstitutionsService();

	getAllOrganismes: OrganismeServiceServer['getAllOrganismes'] = async (call, callback) => {
		try {
			const result = await this.institutionService.getAll({});
			const response: OrganismeList = {
				organismes: result.rows.map(mapInstitutionToProto),
			};
			callback(null, response);
		} catch (error: any) {
			callback({
				code: grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};

	getOrganismeById: OrganismeServiceServer['getOrganismeById'] = async (call, callback) => {
		try {
			const institution = await this.institutionService.getById(call.request.id);

			if (!institution) {
				return callback({
					code: grpc.status.NOT_FOUND,
					message: 'Organisme non trouvé',
				} as grpc.ServiceError);
			}

			callback(null, mapInstitutionToProto(institution));
		} catch (error: any) {
			callback({
				code: grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};

	getOrganismesByIds: OrganismeServiceServer['getOrganismesByIds'] = async (call, callback) => {
		try {
			const institutions = await this.institutionService.getByIds(call.request.ids);

			const response: OrganismeList = {
				organismes: institutions.map(mapInstitutionToProto),
			};

			callback(null, response);
		} catch (error: any) {
			callback({
				code: grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};
}
