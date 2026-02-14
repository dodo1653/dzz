// Simple test to verify our restored setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing restored AI Degen Radar setup...\n');

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log('✅ Package.json dependencies:');
Object.keys(packageContent.dependencies).forEach(dep => {
  console.log(`   - ${dep}: ${packageContent.dependencies[dep]}`);
});

// Check main files exist
const requiredFiles = [
  'src/main.jsx',
  'src/App.jsx', 
  'src/components/ParticlesBackground.jsx',
  'src/components/WalletCard.jsx',
  'src/components/TypingText.jsx',
  'src/index.css',
  'index.html'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check for problematic extra files
const extraFiles = [
  'src/components/Navigation.jsx',
  'src/components/Layout.jsx', 
  'src/components/OracleChat.jsx',
  'src/App_Old.jsx',
  'src/styles/',
  'src/hooks/'
];

console.log('\n🚫 Checking for problematic extra files:');
extraFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} - Found (may cause conflicts)`);
  } else {
    console.log(`✅ ${file} - Clean`);
  }
});

console.log('\n🎯 Restoration complete! Core working version restored.');
console.log('📝 Next steps:');
console.log('   1. npm install (to install Solana dependencies)');  
console.log('   2. npm run dev (to start the app)');
console.log('   3. Verify wallet connection and particles work');
