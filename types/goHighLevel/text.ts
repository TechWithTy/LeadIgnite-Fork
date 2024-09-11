// Restrict the messageType to be either 'SMS' or 'EMAIL'
export type MessageType = 'TYPE_SMS' | 'TYPE_EMAIL';

export interface GetMessagesByConversationIdRequest {
  conversationId: string; // Conversation ID as string
  lastMessageId?: string; // Optional: Last message ID for pagination
  limit?: number; // Optional: Number of messages to fetch (default 20)
  type?: MessageType; // The type of messages to fetch, either 'SMS' or 'EMAIL'
}

// Types for the response of the message API
export interface GetMessagesByConversationIdResponse {
  lastMessageId: string; // Id of the last message in the array
  nextPage: boolean; // Boolean indicating if there are more pages of messages
  messages: Message[]; // Array of message objects
}

// Message type structure, limited to SMS or EMAIL
export interface TextMessage {
  id: string; // Message ID
  type: number; // Type as a number (e.g., 1 for SMS, 3 for EMAIL)
  messageType: MessageType; // Type of message (either 'SMS' or 'EMAIL')
  locationId: string; // Location ID
  contactId: string; // Contact ID
  conversationId: string; // Conversation ID
  dateAdded: string; // ISO timestamp of when the message was added
  body?: string; // Message body (e.g., the SMS text or email content)
  direction: 'inbound' | 'outbound'; // Direction of the message (inbound or outbound)
  status:
    | 'pending'
    | 'scheduled'
    | 'sent'
    | 'delivered'
    | 'read'
    | 'undelivered'
    | 'connected'
    | 'failed'
    | 'opened'; // Status of the message
  contentType: string; // Content type (e.g., "text/plain")
  attachments?: string[]; // Optional array of attachment URLs
  meta?: Meta; // Optional meta object for additional data (e.g., emails)
  source?: 'workflow' | 'bulk_actions' | 'campaign' | 'api' | 'app'; // Optional: source of the message
  userId?: string; // Optional: User ID
}

// Meta data for the message (used for email-type messages)
export interface Meta {
  email?: {
    messageIds: string[]; // List of all email message IDs in the thread
  };
}

export interface TextMessageCampaign {
  id: string; // Campaign ID
  name: string; // Campaign name
  status: 'pending' | 'in-progress' | 'completed' | 'failed'; // Campaign status
  createdAt: string; // Date when the campaign was created (ISO string)
  sentCount: number; // Number of messages sent
  deliveredCount: number; // Number of messages delivered
  failedCount: number; // Number of messages failed
  totalMessages: number; // Total messages in the campaign
  lastMessageSentAt: string; // Date when the last message was sent
  conversationId: string;
  messages: TextMessage[]; // ID of the conversation associated with the campaign
}
