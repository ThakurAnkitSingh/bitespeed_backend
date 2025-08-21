require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Function to safely load CA certificate
function loadCACertificate() {
    try {
        // For Render deployment, try to read from environment variable first
        if (process.env.DB_CA_CERT) {
            return process.env.DB_CA_CERT;
        }

        // Fallback to file if it exists
        const certPath = path.join(__dirname, 'certs', 'ca.pem');
        if (fs.existsSync(certPath)) {
            return fs.readFileSync(certPath);
        }

        console.warn('⚠️  CA certificate not found. Using SSL without CA verification.');
        return null;
    } catch (error) {
        console.warn('⚠️  Could not load CA certificate:', error.message);
        return null;
    }
}

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'bitespeed_db',
            ssl: {
                rejectUnauthorized: false,
                ca: loadCACertificate()
            }
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false,
                ca: loadCACertificate()
            }
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};
