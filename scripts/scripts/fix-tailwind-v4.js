const fs = require('fs');

const configPath = './tailwind.config.js';
const presetLine = `  presets: [require('tailwindcss/preset')],`;

let config = fs.readFileSync(configPath, 'utf-8');
if (!config.includes('presets:')) {
  config = config.replace(/module\.exports\s*=\s*{/, `module.exports = {\n${presetLine}`);
  fs.writeFileSync(configPath, config);
  console.log('✅ Tailwind preset injected');
} else {
  console.log('ℹ️ Preset already present');
}
