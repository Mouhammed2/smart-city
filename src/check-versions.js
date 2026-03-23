
const reactVersion = require('react/package.json').version;
let muiVersion = 'not installed';
try {
  muiVersion = require('@mui/material/package.json').version;
} catch (e) {
  muiVersion = 'NOT INSTALLED';
}

console.log('📊 Version Check:');
console.log('================');
console.log('React version:', reactVersion);
console.log('MUI version:', muiVersion);
console.log('================');

if (reactVersion.startsWith('18.2')) {
  console.log('✅ React version is correct (18.2.x)');
} else {
  console.log('❌ React version should be 18.2.x, but you have', reactVersion);
}

if (muiVersion === 'not installed') {
  console.log('❌ MUI is not installed');
} else if (muiVersion.startsWith('5.')) {
  console.log('✅ MUI version is correct (5.x.x)');
} else {
  console.log('❌ MUI version should be 5.x.x, but you have', muiVersion);
}
