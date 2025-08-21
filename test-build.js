#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing build process locally...\n');

// Test 1: Check if all files exist
console.log('1️⃣  Checking required files...');
const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/index.ts',
    'src/database.ts',
    'src/contactService.ts',
    'src/types.ts',
    'knexfile.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING!`);
        process.exit(1);
    }
});

// Test 2: Check dependencies
console.log('\n2️⃣  Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['express', 'knex', 'mysql2', 'typescript'];

    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
            console.log(`   ✅ ${dep}`);
        } else {
            console.log(`   ❌ ${dep} - MISSING!`);
            process.exit(1);
        }
    });

    // Check type definitions
    console.log('\n   📦 Checking type definitions...');
    const typeDeps = ['@types/express', '@types/node'];
    typeDeps.forEach(dep => {
        if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
            console.log(`      ✅ ${dep}`);
        } else {
            console.log(`      ❌ ${dep} - MISSING!`);
            process.exit(1);
        }
    });
} catch (error) {
    console.error('   ❌ Failed to read package.json:', error.message);
    process.exit(1);
}

// Test 3: TypeScript compilation
console.log('\n3️⃣  Testing TypeScript compilation...');
try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('   ✅ TypeScript compilation successful');
} catch (error) {
    console.error('   ❌ TypeScript compilation failed');
    process.exit(1);
}

// Test 4: Build output
console.log('\n4️⃣  Testing build output...');
try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }

    execSync('npm run build', { stdio: 'inherit' });

    if (fs.existsSync('dist/index.js')) {
        console.log('   ✅ Build output created successfully');
    } else {
        console.log('   ❌ Build output not found');
        process.exit(1);
    }
} catch (error) {
    console.error('   ❌ Build failed:', error.message);
    process.exit(1);
}

console.log('\n🎉 All tests passed! Your project is ready for deployment on Render.');
console.log('\n📋 Next steps:');
console.log('   1. Push your code to GitHub');
console.log('   2. Connect your repo to Render');
console.log('   3. Set environment variables (DB_HOST, DB_USER, etc.)');
console.log('   4. Deploy!');
