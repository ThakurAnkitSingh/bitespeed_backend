# Deployment Guide for Render

## Prerequisites

- A Render account
- Your Aiven MySQL database credentials
- Your Aiven CA certificate

## Step 1: Get Your Aiven CA Certificate

1. **Log into your Aiven Console**
2. **Navigate to your MySQL service**
3. **Go to "Connection Information" tab**
4. **Download the CA certificate** (usually named `ca.pem`)
5. **Copy the entire content** of the certificate file

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** (including the `render.yaml` file)
2. **Connect your GitHub repo to Render**
3. **Render will automatically detect the configuration**

### Option B: Manual Setup

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

## Step 3: Set Environment Variables on Render

In your Render service dashboard, add these environment variables:

### Required Variables:

```
NODE_ENV=production
PORT=10000
DB_HOST=your-aiven-mysql-host.aivencloud.com
DB_PORT=your-port-number
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

### CA Certificate Variable:

```
DB_CA_CERT=-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgILBAAAAAABIVhTCKIwDQYJKoZIhvcNAQELBQAwTDEgMB4G
... (paste your entire CA certificate content here)
-----END CERTIFICATE-----
```

## Step 4: Deploy

1. **Click "Deploy"** in Render
2. **Wait for the build to complete**
3. **Your API will be available at:** `https://your-service-name.onrender.com`

## Step 5: Test Your API

Test the `/identify` endpoint:

```bash
curl -X POST https://your-service-name.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "phoneNumber": "+1234567890"}'
```

## Troubleshooting

### Common Issues:

1. **Build Fails:**

   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation succeeds locally

2. **Database Connection Fails:**

   - Verify all environment variables are set correctly
   - Check that your Aiven database allows external connections
   - Ensure the CA certificate is properly formatted

3. **SSL Issues:**
   - Make sure `DB_CA_CERT` contains the complete certificate
   - Verify the certificate hasn't expired

### SSL Certificate Format:

The `DB_CA_CERT` should look exactly like this:

```
-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgILBAAAAAABIVhTCKIwDQYJKoZIhvcNAQELBQAwTDEgMB4G
A1UECgwXQWR2YW5jZWQgSW5zdGFuY2UgTmV0d29yazEgMB4GA1UECwwXUm9vdCBD
... (more lines)
-----END CERTIFICATE-----
```

## Security Notes

- **Never commit sensitive information** like database passwords or CA certificates to your repository
- **Use Render's environment variables** for all sensitive configuration
- **The CA certificate is stored securely** in Render's environment variables
- **SSL connections** are automatically handled by the application

## Monitoring

- **Check Render logs** for any runtime errors
- **Monitor database connections** in your Aiven dashboard
- **Set up alerts** for any service failures
