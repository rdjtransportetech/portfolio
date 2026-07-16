/**
 * Gera js/config.js a partir de:
 * 1) variavel de ambiente WEB3FORMS_ACCESS_KEY (CI / GitHub Actions), ou
 * 2) arquivo .env local
 *
 * Uso local:  node scripts/sync-env.js
 * Uso no CI:  WEB3FORMS_ACCESS_KEY=... node scripts/sync-env.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'js', 'config.js');

function readKeyFromEnvFile() {
  if (!fs.existsSync(envPath)) return null;
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^\s*WEB3FORMS_ACCESS_KEY\s*=\s*(.+)\s*$/m);
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

const accessKey = (process.env.WEB3FORMS_ACCESS_KEY || readKeyFromEnvFile() || '')
  .trim()
  .replace(/^["']|["']$/g, '');

if (!accessKey || accessKey === 'sua_chave_web3forms_aqui') {
  console.error(
    'WEB3FORMS_ACCESS_KEY ausente. Defina no .env local ou como secret/variavel de ambiente.'
  );
  process.exit(1);
}

const configJs = `/* Gerado automaticamente por scripts/sync-env.js - nao edite manualmente */
window.RDJ_CONFIG = {
  web3formsAccessKey: ${JSON.stringify(accessKey)}
};
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, configJs, 'utf8');
console.log('js/config.js gerado com sucesso');
