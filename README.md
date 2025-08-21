# Bitespeed Identity Reconciliation API

A focused web service that implements the exact requirements from the Bitespeed task.

## ✅ Requirements Met

- POST `/identify` endpoint
- Accepts JSON with `email` and/or `phoneNumber`
- Links contacts with matching email/phone
- Maintains primary/secondary hierarchy
- Returns consolidated contact information

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database**
   ```bash
   # Copy environment file
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Test the API**
   ```bash
   node test-api.js
   ```

## 📡 API Usage

### POST /identify

**Request:**
Test 1: New Contact (Should Create Primary)

```json
{
  "email": "newuser@example.com",
  "phoneNumber": "1111111111"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 7,
    "emails": ["newuser@example.com"],
    "phoneNumbers": ["1111111111"],
    "secondaryContactIds": []
  }
}
```


Test 2: Existing Email (Should Link to Contact 1)

```json
{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "2222222222"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu", "newemail@example.com"],
    "phoneNumbers": ["123456", "999999", "2222222222"],
    "secondaryContactIds": [2, 3, 8]
  }
}
```


Test 3: Existing Phone (Should Link to Contact 1)

```json
{
  "email": "different@example.com",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu", "different@example.com"],
    "phoneNumbers": ["123456", "999999", "2222222222"],
    "secondaryContactIds": [2, 3, 8, 9]
  }
}
```


Test 4: Email Only (Should Link to Contact 5)

```json
{
  "email": "emailonly@example.com",
  "phoneNumber": "3333333333"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 5,
    "emails": ["emailonly@example.com"],
    "phoneNumbers": ["3333333333"],
    "secondaryContactIds": [10]
  }
}
```


Test 5: Phone Only (Should Link to Contact 6)

```json
{
  "email": "newemail@example.com",
  "phoneNumber": "phoneonly"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 6,
    "emails": ["newemail@example.com"],
    "phoneNumbers": ["phoneonly"],
    "secondaryContactIds": [11]
  }
}
```

## 🏗️ Architecture

- **TypeScript** - Type safety
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Functional** - Pure functions approach

## 📁 Project Structure

```
src/
├── types.ts          # TypeScript interfaces
├── database.ts       # Database operations
├── contactService.ts # Business logic
└── index.ts         # Express server
```
