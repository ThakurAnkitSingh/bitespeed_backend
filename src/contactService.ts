import { Contact } from "./database";
import { IdentifyRequest, ContactResponse } from "./types";
import {
  findExistingContacts,
  createContact,
  updateContactPrecedence,
  updateContactLink,
} from "./database";

// Pure function to check for new information
export const hasNewInformation = (
  request: IdentifyRequest,
  existingContacts: Contact[]
): boolean => {
  const existingEmails = existingContacts
    .map((c) => c.email)
    .filter(Boolean) as string[];

  const existingPhoneNumbers = existingContacts
    .map((c) => c.phoneNumber)
    .filter(Boolean) as string[];

  const hasNewEmail = request.email
    ? !existingEmails.includes(request.email)
    : false;
  const hasNewPhone = request.phoneNumber
    ? !existingPhoneNumbers.includes(request.phoneNumber)
    : false;

  return hasNewEmail || hasNewPhone;
};

// Pure function to build contact response
export const buildContactResponse = (
  primaryContact: Contact,
  allContacts: Contact[]
): ContactResponse => {
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds: number[] = [];

  // Add primary contact info first
  if (primaryContact.email) emails.add(primaryContact.email);
  if (primaryContact.phoneNumber) phoneNumbers.add(primaryContact.phoneNumber);

  // Add secondary contact info
  allContacts.forEach((contact) => {
    if (contact.id === primaryContact.id) return; // Skip primary contact

    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);

    if (contact.linkPrecedence === "secondary") {
      secondaryContactIds.push(contact.id);
    }
  });

  return {
    primaryContatctId: primaryContact.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: secondaryContactIds.sort((a, b) => a - b),
  };
};

// Main identity reconciliation function
export const identifyContact = async (
  request: IdentifyRequest
): Promise<ContactResponse> => {
  // Find existing contacts that match the request
  const existingContacts = await findExistingContacts(
    request.email,
    request.phoneNumber
  );

  if (existingContacts.length === 0) {
    // No existing contacts found, create a new primary contact
    const newContact = await createContact(request.email, request.phoneNumber);

    return {
      primaryContatctId: newContact.id,
      emails: newContact.email ? [newContact.email] : [],
      phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
      secondaryContactIds: [],
    };
  }

  // Find the primary contact among existing contacts
  let primaryContact = existingContacts.find(
    (c) => c.linkPrecedence === "primary"
  );

  if (!primaryContact) {
    // If no primary contact found, make the oldest contact primary
    primaryContact = existingContacts.reduce((oldest, current) =>
      current.createdAt < oldest.createdAt ? current : oldest
    );
    await updateContactPrecedence(primaryContact.id, "primary");
    primaryContact.linkPrecedence = "primary";
  }

  // Check if we need to create a new secondary contact
  const hasNewInfo = hasNewInformation(request, existingContacts);

  if (hasNewInfo) {
    // Create a new secondary contact
    const newSecondaryContact = await createContact(
      request.email,
      request.phoneNumber
    );

    // Update the new contact to be secondary and linked
    await updateContactLink(
      newSecondaryContact.id,
      primaryContact.id,
      "secondary"
    );

    // Add to existing contacts for response
    existingContacts.push({
      ...newSecondaryContact,
      linkPrecedence: "secondary",
      linkedId: primaryContact.id,
    });
  }

  // Build and return response
  return buildContactResponse(primaryContact, existingContacts);
};
