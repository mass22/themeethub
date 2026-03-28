const [maj] = process.versions.node.split('.').map(Number)
/** LTS active (stable), pas la branche « Current ». */
const minMaj = 24
if (maj < minMaj) {
  console.error(
    `[themeethub] Node ${process.version} : ce projet cible Node ${minMaj}+ LTS (voir package.json engines et .nvmrc).\n` +
      '  → nvm install && nvm use, ou fnm / mise selon ton setup.'
  )
  process.exit(1)
}
