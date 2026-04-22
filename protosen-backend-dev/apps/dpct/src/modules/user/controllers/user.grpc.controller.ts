import { UserServiceServer, User, UsersResponse, UserResponse } from '@grpc/generated/user';
import { UsersService } from '../services/user.service';
import * as grpc from '@grpc/grpc-js';
import { User as UserModel } from 'database/models';

/**
 * Mapping Sequelize User model to Protobuf User message
 */
function mapUserToProto(user: UserModel): User {
	return User.create({
		id: user.id.toString(),
		email: user.email,
		firstName: user.first_name,
		lastName: user.last_name,
		phone: user.phone ?? undefined,
		role: user.role,
		verificationCode: user.verification_code ?? undefined,
		status: user.status,
		confirmed: user.confirmed,
		deleted: user.deleted,
		organismId: user.organismId,
		accessGroupId: user.accessGroupId,
		organism: user.organism ? user.organism.toJSON() : undefined,
		accessGroup: user.accessGroup ? user.accessGroup.toJSON() : undefined,
	});
}

/**
 * gRPC Controller for User Service
 * Implements UserServiceServer interface from generated proto
 */
export class UserGrpcController implements UserServiceServer {
	[method: string]: any;
	private userService = new UsersService();

	getUserByToken: UserServiceServer['getUserByToken'] = async (call, callback) => {
		try {
			const user = await this.userService.getUserByToken(call.request.token);

			if (!user) {
				return callback({
					code: grpc.status.NOT_FOUND,
					message: 'Utilisateur non trouvé',
				} as grpc.ServiceError);
			}

			callback(null, mapUserToProto(user));
		} catch (error: any) {
			const isAuthError = error.message?.includes('Token');
			callback({
				code: isAuthError ? grpc.status.UNAUTHENTICATED : grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};

	getUsersByIds: UserServiceServer['getUsersByIds'] = async (call, callback) => {
		try {
			const users = await this.userService.getUsersByIds(call.request.ids);

			callback(
				null,
				UsersResponse.create({
					users: users.map(mapUserToProto),
				}),
			);
		} catch (error: any) {
			callback({
				code: grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};

	getUser: UserServiceServer['getUser'] = async (call, callback) => {
		try {
			const whereClause = Object.fromEntries(
				Object.entries(call.request).filter(([_, value]) => value !== undefined),
			);

			const user = await this.userService.getOne(whereClause);

			if (!user) {
				return callback({
					code: grpc.status.NOT_FOUND,
					message: 'Utilisateur non trouvé',
				} as grpc.ServiceError);
			}

			callback(
				null,
				UserResponse.create({
					user: mapUserToProto(user),
				}),
			);
		} catch (error: any) {
			callback({
				code: grpc.status.INTERNAL,
				message: error.message || 'Erreur interne',
			} as grpc.ServiceError);
		}
	};
}
