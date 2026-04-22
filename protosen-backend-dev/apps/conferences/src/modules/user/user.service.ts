import { Injectable, OnModuleInit } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  UserServiceClient,
  User,
  UserResponse,
  UsersResponse,
  TokenRequest,
  IdsRequest,
  UserRequest,
} from './generated/user';

@Injectable()
export class UserService implements OnModuleInit {
  private client: UserServiceClient;
  private readonly SERVER_ADDRESS: string = process.env.DPCT_GRPC_URL;
  private readonly API_KEY: string = process.env.GRPC_API_KEY;

  onModuleInit() {
    // Charger le fichier `user.proto`
    const packageDefinition = protoLoader.loadSync(
      join(__dirname, './protos/user.proto'),
      {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    );

    const userProto: any = grpc.loadPackageDefinition(packageDefinition).users;

    // Créer un client gRPC pour `UserService`
    this.client = new userProto.UserService(
      this.SERVER_ADDRESS,
      grpc.credentials.createInsecure(),
    ) as unknown as UserServiceClient;
    console.log('✅ Client gRPC connecté avec succès à UserService');
  }

  /**
   * 🔹 Ajouter l'API Key dans les métadonnées
   */
  private getMetadata(): Metadata {
    const metadata = new Metadata();
    metadata.add('api-key', this.API_KEY);
    return metadata;
  }

  /**
   * 🔹 Récupérer un utilisateur par Token (RxJS Observable)
   * @param token - The authentication token.
   * @returns An observable containing the user data.
   */
  getUserByToken(token: string): Observable<User> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();
      const request: TokenRequest = { token };

      this.client.getUserByToken(request, metadata, (error, response) => {
        if (error) {
          console.error(
            `🚨 Erreur lors de l’appel à GetUserByToken ${token}:`,
            error,
          );
          observer.error(error);
        } else {
          // console.log(`✅ Utilisateur récupéré par Token:`, response);
          observer.next(response);
          observer.complete();
        }
      });
    });
  }

  /**
   * 🔹 Retrieves a list of users by their IDs.
   * @param ids - An array of user IDs.
   * @returns An observable containing the users data (RxJS Observable).
   */
  getUsersByIds(ids: string[]): Observable<UsersResponse> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();
      const request: IdsRequest = { ids };

      this.client.getUsersByIds(request, metadata, (error, response) => {
        if (error) {
          console.error('🚨 Erreur lors de l’appel à GetUsersByIds:', error);
          observer.error(error);
        } else {
          console.log(
            `✅ Utilisateurs récupérés (${ids.length} IDs):`,
            response.users,
          );
          observer.next(response);
          observer.complete();
        }
      });
    });
  }

  /**
   * 🔹 Récupérer un utilisateur par ID ou email (RxJS Observable)
   */
  getUser(request: UserRequest): Observable<UserResponse> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();

      this.client.getUser(request, metadata, (error, response) => {
        if (error) {
          console.error(`🚨 Erreur lors de l’appel à GetUser:`, error);
          observer.error(error);
        } else {
          console.log(`✅ Utilisateur récupéré:`, response.user);
          observer.next(response);
          observer.complete();
        }
      });
    });
  }
}
