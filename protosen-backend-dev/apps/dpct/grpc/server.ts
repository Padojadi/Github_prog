import * as grpc from "@grpc/grpc-js";
import { UserServiceService } from "./generated/user";
import { OrganismeServiceService } from "./generated/organisme";
import * as dotenv from 'dotenv';
dotenv.config();

// Validate environment variables before anything else
import "../src/config/env.config";

import connectToPostgresSQL from "../src/config/database";
import { UserGrpcController } from "@modules/user/controllers/user.grpc.controller";
import { InstitutionGrpcController } from "@modules/institution/controllers/institution.grpc.controller";
import { ReflectionService } from '@grpc/reflection';
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { withApiKeyAuth } from "./auth.interceptor";
import log from "@shared/utils/logger";
import env from "@appconfig/env.config";

connectToPostgresSQL();

const GRPC_PORT = process.env.GRPC_PORT;


// Charger les fichiers .proto pour la réflexion
const packageDefinition = protoLoader.loadSync([
  path.join(__dirname, '../src/modules/user/protos/user.proto'),
  path.join(__dirname, '../src/modules/institution/protos/organisme.proto')
], {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});


// Start the gRPC server and listen for incoming connections
export function startGrpcServer() {
  const server = new grpc.Server({
    "grpc.max_receive_message_length": 1024 * 1024 * 100,
    "grpc.max_send_message_length": 1024 * 1024 * 100,
  });

  // 📌 Ajouter les services gRPC avec les nouveaux controllers
  server.addService(UserServiceService, withApiKeyAuth(new UserGrpcController()));
  server.addService(OrganismeServiceService, withApiKeyAuth(new InstitutionGrpcController()));


  // 📌 Activer la réflexion si configuré
  if (env.GRPC_ENABLE_REFLECTION === 'true') {
    const reflection = new ReflectionService(packageDefinition);
    reflection.addToServer(server);
    log.info('gRPC reflection enabled');
  }

  server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      log.error({ err }, 'Error starting gRPC server');
      return;
    }
    log.info({ port }, 'gRPC server is running');
  });
}

startGrpcServer()