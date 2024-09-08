// Reusing the assistant types from CreateCallRequest

import { Assistant } from './create';

// Call types
export type CallType = 'inboundPhoneCall' | 'outboundPhoneCall' | 'webCall';

// Available call statuses
export type CallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'forwarding'
  | 'ended';

// Call end reasons
export type EndedReason =
  | 'assistant-error'
  | 'assistant-not-found'
  | 'customer-busy'
  | 'exceeded-max-duration'
  | 'manually-canceled';
// Add the other reasons as specified...

// Cost breakdown of the call
export interface CostBreakdown {
  transport: number;
  stt: number;
  llm: number;
  tts: number;
  vapi: number;
  total: number;
  llmPromptTokens: number;
  llmCompletionTokens: number;
  ttsCharacters: number;
}

// Artifact Plan and Analysis
export interface ArtifactPlan {
  videoRecordingEnabled: boolean;
  recordingS3PathPrefix: string;
}

export interface AnalysisPlan {
  summary: string;
  structuredData: Record<string, unknown>;
  successEvaluation: string;
}

// Call response type
export interface GetCallResponse {
  id: string; // Unique identifier for the call
  orgId: string; // Unique identifier for the org
  type: CallType; // Type of the call
  phoneCallProvider: 'twilio' | 'vonage' | 'vapi'; // Provider of the call
  phoneCallTransport: 'sip' | 'pstn'; // Transport of the call
  status: CallStatus; // Status of the call
  endedReason?: EndedReason; // Why the call ended (optional)
  messages: Message[]; // Messages spoken during the call
  destination?: Destination; // Transfer destination
  createdAt: string; // ISO date-time of call creation
  updatedAt: string; // ISO date-time of last update
  startedAt?: string; // ISO date-time of when the call started
  endedAt?: string; // ISO date-time of when the call ended
  cost: number; // Cost of the call
  costBreakdown: CostBreakdown; // Cost breakdown
  transcript: string; // Transcript of the call
  recordingUrl?: string; // Recording URL
  stereoRecordingUrl?: string; // Stereo recording URL
  artifact?: ArtifactPlan; // Artifact details
  analysis?: AnalysisPlan; // Analysis details
  assistantId?: string; // Assistant ID
  assistant?: Assistant; // Assistant data (reusing existing type)
}

// Destination object
export interface Destination {
  type: 'number'; // Type of the destination
  numberE164CheckEnabled: boolean; // E164 validation
  number: string; // Phone number
  extension: string; // Extension (optional)
  message: string; // Message (optional)
  description: string; // Description (optional)
}
