#!/usr/bin/env node

// patch-vue-plugin.js - Script pour patcher @vitejs/plugin-vue et Vite
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const filesToPatch = [
  'node_modules/@vitejs/plugin-vue/dist/index.js',
  'node_modules/vite/dist/node/chunks/dep-eRCq8YxU.js'
]

let patchedCount = 0

for (const filePath of filesToPatch) {
  if (!existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`)
    continue
  }

  try {
    console.log(`🔧 Patching ${filePath}...`)

    let content = readFileSync(filePath, 'utf8')

    // Vérifier si le patch est déjà appliqué
    if (!content.includes('crypto.hash')) {
      console.log(`✅ ${filePath} déjà patché`)
      patchedCount++
      continue
    }

    // Pour le plugin Vue
    if (filePath.includes('plugin-vue')) {
      // Ajouter l'import de createHash au début si nécessaire
      if (!content.includes('import { createHash } from "node:crypto"')) {
        content = 'import { createHash } from "node:crypto";\n' + content
      }

      // Remplacer crypto.hash par createHash
      content = content.replace(
        'crypto.hash("sha256", text, "hex")',
        'createHash("sha256").update(text).digest("hex")'
      )
    }

    // Pour Vite
    if (filePath.includes('dep-eRCq8YxU.js')) {
      // Remplacer crypto.hash par createHash pour Vite
      content = content.replace(
        /crypto\.hash\("sha256", ([^,]+), "hex"\)/g,
        'crypto.createHash("sha256").update($1).digest("hex")'
      )
    }

    writeFileSync(filePath, content)
    console.log(`✅ ${filePath} patché avec succès`)
    patchedCount++

  } catch (error) {
    console.error(`❌ Erreur lors du patch de ${filePath}:`, error.message)
  }
}

console.log(`\n🎉 Patch terminé: ${patchedCount}/${filesToPatch.length} fichiers traités`)

if (patchedCount === 0) {
  console.log('⚠️  Aucun fichier n\'a pu être patché')
  process.exit(1)
}
