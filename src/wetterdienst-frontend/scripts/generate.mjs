import { execSync } from 'child_process';

const [type, name] = process.argv.slice(2);

const typeMap = {
  component: '../components',
  container: '../containers',
  service:   '../services',
};

const schematic = type === 'service' ? 'service' : 'component';
const folder = typeMap[type];

if (!folder || !name) {
  console.error('Usage: node scripts/generate.mjs <component|container|service> <name>');
  process.exit(1);
}

execSync(`ng generate ${schematic} ${folder}/${name}`, { stdio: 'inherit' });