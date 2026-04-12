import * as grpc from "@grpc/grpc-js";
import * as crypto from "crypto";
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GRPC_API_KEY;

/**
 * Compare deux chaînes de manière sécurisée contre les timing attacks.
 * Utilise une comparaison à temps constant.
 */
function secureCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Pour éviter de révéler la longueur, on compare quand même
    // mais avec un buffer de même taille
    const padded = Buffer.alloc(bufA.length);
    bufB.copy(padded);
    crypto.timingSafeEqual(bufA, padded);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyApiKey(
  call: grpc.ServerUnaryCall<unknown, unknown>,
  callback: grpc.sendUnaryData<unknown>,
  next: () => void
): void {
  const metadata = call.metadata.get("api-key");

  if (!metadata || metadata.length === 0) {
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: "Unauthorized: Missing API Key",
    } as grpc.ServiceError);
    return;
  }

  const providedApiKey = metadata[0];

  if (typeof providedApiKey !== 'string' || !API_KEY || !secureCompare(providedApiKey, API_KEY)) {
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: "Unauthorized: Invalid API Key",
    } as grpc.ServiceError);
    return;
  }

  next();
}

type GrpcHandler = (call: grpc.ServerUnaryCall<unknown, unknown>, callback: grpc.sendUnaryData<unknown>) => void;
type ServiceImplementation = Record<string, GrpcHandler>;

export function withApiKeyAuth(serviceImplementation: ServiceImplementation): ServiceImplementation {
  return Object.keys(serviceImplementation).reduce<ServiceImplementation>((securedService, methodName) => {
    const originalMethod = serviceImplementation[methodName];

    securedService[methodName] = (call, callback) => {
      verifyApiKey(call, callback, () => {
        originalMethod(call, callback);
      });
    };

    return securedService;
  }, {});
}