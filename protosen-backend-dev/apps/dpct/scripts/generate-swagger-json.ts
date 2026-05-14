import { loadSwaggerDocumentation } from '../src/config/swagger.config';
import fs from 'fs';
import path from 'path';

/**
 * ⚠️  NE PAS SUPPRIMER - Script essentiel pour la génération de la documentation Swagger
 *
 * Script pour générer le fichier swagger.json
 * Usage: npx ts-node scripts/generate-swagger-json.ts
 */

try {
  console.log('🔄 Génération du fichier swagger.json...\n');

  // Charger la documentation Swagger
  const swaggerDoc = loadSwaggerDocumentation();

  // Chemin de sortie
  const outputPath = path.join(process.cwd(), 'swagger.json');

  // Écrire le fichier JSON
  fs.writeFileSync(
    outputPath,
    JSON.stringify(swaggerDoc, null, 2),
    'utf-8'
  );

  console.log('✅ Fichier swagger.json généré avec succès!\n');
  console.log('📁 Emplacement:', outputPath);
  console.log('\n📊 Statistiques:');
  console.log('  - Paths:', Object.keys(swaggerDoc.paths || {}).length);
  console.log('  - Schemas:', Object.keys(swaggerDoc.components?.schemas || {}).length);
  console.log('  - Tags:', (swaggerDoc.tags || []).length);

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`  - Taille: ${fileSizeKB} KB\n`);

} catch (error: any) {
  console.error('❌ Erreur lors de la génération:', error.message);
  process.exit(1);
}
