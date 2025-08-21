#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking build environment...');

// Check if TypeScript is available
try {
    const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' });
    console.log('✅ TypeScript version:', tscVersion.trim());
} catch (error) {
    console.error('❌ TypeScript not found:', error.message);
    process.exit(1);
}

// Check if all required dependencies are installed
const requiredDeps = [
    'express',
    'knex',
    'mysql2'
];

console.log('\n📦 Checking dependencies...');
requiredDeps.forEach(dep => {
    try {
        require.resolve(dep);
        console.log(`✅ ${dep} - OK`);
    } catch (error) {
        console.log(`❌ ${dep} - Missing`);
    }
});

// Check type definitions separately
console.log('\n📦 Checking type definitions...');
const typeDeps = ['@types/express', '@types/node'];
typeDeps.forEach(dep => {
    try {
        require.resolve(dep);
        console.log(`✅ ${dep} - OK`);
    } catch (error) {
        console.log(`⚠️  ${dep} - Not accessible (this is normal in some environments)`);
    }
});

// Check TypeScript configuration
console.log('\n⚙️  Checking TypeScript config...');
if (fs.existsSync('tsconfig.json')) {
    console.log('✅ tsconfig.json exists');
} else {
    console.log('❌ tsconfig.json missing');
}

// Try to compile
console.log('\n🔨 Attempting TypeScript compilation...');
try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript compilation successful (no errors)');
} catch (error) {
    console.error('❌ TypeScript compilation failed');
    console.error('Error details:', error.message);
    process.exit(1);
}

console.log('\n🎉 Build environment check completed successfully!');
