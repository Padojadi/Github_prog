import { Injectable, OnModuleInit } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  OrganismeServiceClient,
  Organisme,
  OrganismeList,
  OrganismeIdRequest,
  OrganismeIdsRequest,
} from './generated/organisme';

@Injectable()
export class InstitutionService implements OnModuleInit {
  private client: OrganismeServiceClient;
  private readonly SERVER_ADDRESS: string = process.env.DPCT_GRPC_URL;
  private readonly API_KEY: string = process.env.GRPC_API_KEY;

  onModuleInit() {
    // Charger le fichier `organisme.proto`
    const packageDefinition = protoLoader.loadSync(
      join(__dirname, './protos/organisme.proto'),
      {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    );

    const organismeProto: any =
      grpc.loadPackageDefinition(packageDefinition).organisme;

    // Créer un client gRPC pour `OrganismeService`
    this.client = new organismeProto.OrganismeService(
      this.SERVER_ADDRESS,
      grpc.credentials.createInsecure(),
    ) as unknown as OrganismeServiceClient;
    console.log('✅ Client gRPC connecté avec succès à OrganismeService');
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
   * 🔹 Récupérer tous les organismes (RxJS Observable)
   */
  getAllOrganismes(): Observable<OrganismeList> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();
      this.client.getAllOrganismes({}, metadata, (error, response) => {
        if (error) {
          console.error('🚨 Erreur lors de l’appel à GetAllOrganismes:', error);
          observer.error(error);
        } else {
          console.log('✅ Liste des organismes:', response.organismes);
          observer.next(response);
          observer.complete();
        }
      });
    });
  }

  /**
   * 🔹 Récupérer un organisme par ID (RxJS Observable)
   */
  getOrganismeById(id: string): Observable<Organisme> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();
      const request: OrganismeIdRequest = { id };

      this.client.getOrganismeById(request, metadata, (error, response) => {
        if (error) {
          console.error(
            `🚨 Erreur lors de l’appel à GetOrganismeById (${id}):`,
            error,
          );
          observer.error(error);
        } else {
          console.log(`✅ Organisme trouvé (${id}):`, response);
          observer.next(response);
          observer.complete();
        }
      });
    });
  }

  /**
   * 🔹 Récupérer plusieurs organismes par IDs (RxJS Observable)
   */
  getOrganismesByIds(ids: string[]): Observable<OrganismeList> {
    return new Observable((observer) => {
      const metadata = this.getMetadata();
      const request: OrganismeIdsRequest = { ids };

      this.client.getOrganismesByIds(request, metadata, (error, response) => {
        if (error) {
          console.error(
            '🚨 Erreur lors de l’appel à GetOrganismesByIds:',
            error,
          );
          observer.error(error);
        } else {
          console.log(
            `✅ Organismes trouvés (${ids.length} IDs) :`,
            response.organismes,
          );
          observer.next(response);
          observer.complete();
        }
      });
    });
  }
}
