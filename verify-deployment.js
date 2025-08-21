#!/usr/bin/env node

console.log('🚀 Verifying deployment readiness...\n');

// Test 1: Check if build works
console.log('1️⃣  Testing build process...');
try {
    const { execSync } = require('child_process');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('   ✅ Build successful!');
} catch (error) {
    console.log('   ❌ Build failed!');
    process.exit(1);
}

// Test 2: Check if dist files exist
console.log('\n2️⃣  Checking build output...');
const fs = require('fs');
if (fs.existsSync('dist/index.js')) {
    console.log('   ✅ dist/index.js exists');
} else {
    console.log('   ❌ dist/index.js missing');
    process.exit(1);
}

// Test 3: Check package.json
console.log('\n3️⃣  Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Check required dependencies
    const requiredDeps = ['express', 'knex', 'mysql2', 'typescript'];
    let allDepsOk = true;

    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`   ✅ ${dep} in dependencies`);
        } else {
            console.log(`   ❌ ${dep} missing from dependencies`);
            allDepsOk = false;
        }
    });

    if (!allDepsOk) {
        console.log('   ❌ Some required dependencies are missing');
        process.exit(1);
    }

    console.log('   ✅ All required dependencies present');
} catch (error) {
    console.log('   ❌ Failed to read package.json');
    process.exit(1);
}

console.log('\n🎉 Deployment verification completed successfully!');
console.log('\n📋 Your project is ready for Render deployment.');
console.log('\nNext steps:');
console.log('1. Push code to GitHub');
console.log('2. Connect repo to Render');
console.log('3. Set environment variables');
console.log('4. Deploy!');
