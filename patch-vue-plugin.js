#!/usr/bin/env node

// patch-vue-plugin.js - Script pour patcher @vitejs/plugin-vue et Vite
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const filesToPatch = [
  'node_modules/@vitejs/plugin-vue/dist/index.mjs',
  'node_modules/vite/dist/node/chunks/config.js'
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

    // Pour le plugin Vue (index.mjs - crypto déjà importé)
    if (filePath.includes('plugin-vue')) {
      content = content.replace(
        'crypto.hash("sha256", text, "hex")',
        'crypto.createHash("sha256").update(text).digest("hex")'
      )
    }

    // Pour Vite config.js (crypto.hash = API Node 21.7+, créer createHash pour compatibilité)
    if (filePath.includes('vite') && filePath.includes('config.js')) {
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
  console.log('⚠️  Aucun fichier n\'a pu être patché (versions peut-être mises à jour)')
}
