import { BadRequestException } from '@nestjs/common';

/**
 * Génère un code court aléatoire pour identifier des éléments uniques.
 * Le code court est composé de la date actuelle au format AAAA-MM-JJ et d'une chaîne aléatoire de 6 caractères.
 *
 * @returns {string} Le code court généré.
 */
export function generateShortCode(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un 0 si nécessaire
  const day = now.getDate().toString().padStart(2, '0'); // Ajoute un 0 si nécessaire
  const random = crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(36) // base 36 = chiffres + lettres minuscules
    .slice(0, 6); // garde les 6 premiers caractères

  return `${year}-${month}${day}-${random}`;
}

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
    return callback(
      new BadRequestException('Le fichier doit être une image'),
      false,
    );
  }
  callback(null, true);
};
