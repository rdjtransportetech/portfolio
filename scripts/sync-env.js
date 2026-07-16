/**
 * Gera js/config.js a partir do arquivo .env
 * Uso: node scripts/sync-env.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'js', 'config.js');

if (!fs.existsSync(envPath)) {
  console.error('Arquivo .env não encontrado. Copie .env.example para .env e preencha a chave.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^\s*WEB3FORMS_ACCESS_KEY\s*=\s*(.+)\s*$/m);

if (!match) {
  console.error('WEB3FORMS_ACCESS_KEY não encontrada no .env');
  process.exit(1);
}

const accessKey = match[1].trim().replace(/^["']|["']$/g, '');

if (!accessKey || accessKey === 'sua_chave_web3forms_aqui') {
  console.error('Defina uma WEB3FORMS_ACCESS_KEY válida no .env');
  process.exit(1);
}

const configJs = `/* Gerado automaticamente por scripts/sync-env.js - nao edite manualmente */
window.RDJ_CONFIG = {
  web3formsAccessKey: ${JSON.stringify(accessKey)}
};
`;

fs.writeFileSync(outPath, configJs, 'utf8');
console.log('js/config.js gerado com sucesso a partir do .env');
