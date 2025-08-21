// Request types as specified in requirements
export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

// Response types as specified in requirements
export interface ContactResponse {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export interface ApiResponse {
  contact: ContactResponse;
}
