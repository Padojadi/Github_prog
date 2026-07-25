/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `avatarUrl` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- Étape 1 : Ajouter la colonne `code` (elle est nullable au départ)
ALTER TABLE "Participant" ADD COLUMN "code" TEXT;

-- Étape 2 : Mettre à jour les valeurs NULL de avatarUrl
UPDATE "Participant"
SET "avatarUrl" = 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1633660134/avatars/default-avatar.png'
WHERE "avatarUrl" IS NULL;

-- Étape 3 : Rendre avatarUrl NOT NULL et ajouter un DEFAULT
ALTER TABLE "Participant"
ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET DEFAULT 'https://res.cloudinary.com/djx5h4cjt/image/upload/v1633660134/avatars/default-avatar.png';

-- Étape 4 : Ajouter la contrainte d'unicité sur le champ code
CREATE UNIQUE INDEX "Participant_code_key" ON "Participant"("code");

