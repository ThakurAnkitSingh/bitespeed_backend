import knex, { Knex } from "knex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexfile = require("../knexfile");

// Use production config on Render, development locally
const config =
  process.env.NODE_ENV === "production" ? "production" : "development";

// Validate configuration exists
if (!knexfile[config]) {
  console.error(`❌ Database configuration '${config}' not found in knexfile`);
  console.error(`Available configs: ${Object.keys(knexfile).join(", ")}`);
  throw new Error(`Database configuration '${config}' not found in knexfile`);
}

const db = knex(knexfile[config] as any);

// Contact interface for TypeScript
export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Functional approach - pure functions for database operations
export const findExistingContacts = async (
  email?: string,
  phoneNumber?: string
): Promise<Contact[]> => {
  const whereConditions: { email?: string; phoneNumber?: string }[] = [];

  if (email) {
    whereConditions.push({ email });
  }

  if (phoneNumber) {
    whereConditions.push({ phoneNumber });
  }

  const contacts = await db("contacts")
    .where(function (this: Knex.QueryBuilder) {
      if (whereConditions.length > 0) {
        this.where(function (this: Knex.QueryBuilder) {
          whereConditions.forEach((condition) => {
            this.orWhere(condition);
          });
        });
      }
    })
    .whereNull("deletedAt")
    .orderBy("createdAt", "asc");

  // Find linked contacts
  const linkedContactIds = contacts
    .filter((c) => c.linkedId)
    .map((c) => c.linkedId!)
    .filter((id, index, arr) => arr.indexOf(id) === index);

  if (linkedContactIds.length > 0) {
    const linkedContacts = await db("contacts")
      .whereNull("deletedAt")
      .where(function (this: Knex.QueryBuilder) {
        this.whereIn("id", linkedContactIds).orWhereIn(
          "linkedId",
          linkedContactIds
        );
      });

    const allContacts = [...contacts, ...linkedContacts];
    return allContacts.filter(
      (contact, index, self) =>
        index === self.findIndex((c) => c.id === contact.id)
    );
  }

  return contacts;
};

export const createContact = async (
  email?: string,
  phoneNumber?: string
): Promise<Contact> => {
  const insertData = {
    email: email || null,
    phoneNumber: phoneNumber || null,
    linkPrecedence: "primary",
    linkedId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [insertId] = await db("contacts").insert(insertData);

  // Return the created contact by fetching it, as .returning() is not supported by MySQL
  const [contact] = await db("contacts").where({ id: insertId }).select("*");
  return contact;
};

export const updateContactPrecedence = async (
  id: number,
  precedence: "primary" | "secondary"
): Promise<Contact> => {
  await db("contacts").where({ id }).update({
    linkPrecedence: precedence,
    updatedAt: new Date(),
  });

  // Return the updated contact by fetching it, as .returning() is not supported by MySQL
  const [contact] = await db("contacts").where({ id }).select("*");
  return contact;
};

export const updateContactLink = async (
  id: number,
  linkedId: number,
  precedence: "primary" | "secondary"
): Promise<Contact> => {
  await db("contacts").where({ id }).update({
    linkedId,
    linkPrecedence: precedence,
    updatedAt: new Date(),
  });

  // Return the updated contact by fetching it, as .returning() is not supported by MySQL
  const [contact] = await db("contacts").where({ id }).select("*");
  return contact;
};

export const disconnect = async (): Promise<void> => {
  await db.destroy();
};
