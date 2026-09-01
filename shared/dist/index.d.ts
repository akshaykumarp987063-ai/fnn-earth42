export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentUrgency = "IMMEDIATE" | "SOON" | "NORMAL";
export type IncidentCategory = "MEDICAL" | "FIRE" | "PERSONAL_SAFETY" | "INFRASTRUCTURE" | "NATURAL_DISASTER" | "LOST_PERSON" | "LOST_ITEM" | "OTHER";
export type IncidentStatus = "OPEN" | "VERIFIED" | "ASSIGNED" | "RESPONDING" | "RESOLVED" | "ESCALATED";
export type UserRole = "STUDENT" | "HERO" | "ADMIN";
export interface User {
    id: string;
    email: string;
    pseudonym: string;
    role: UserRole;
    credits: number;
    reputation: number;
}
export interface AIIncidentResult {
    category: IncidentCategory;
    summary: string;
    severity: IncidentSeverity;
    urgency: IncidentUrgency;
    confidence: number;
    recommendedResponder: string;
}
export interface Incident {
    id: string;
    reporterId: string;
    description: string;
    category: IncidentCategory;
    severity: IncidentSeverity;
    urgency: IncidentUrgency;
    confidence: number;
    latitude: number;
    longitude: number;
    status: IncidentStatus;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    updatedAt: string;
}
export interface CreateIncidentRequest {
    description: string;
    latitude: number;
    longitude: number;
    mediaUrl?: string;
}
export interface LocationProof {
    incidentId: string;
    userId: string;
    latitude: number;
    longitude: number;
    mediaUrl: string;
}
export type VoteType = "UP" | "DOWN";
export interface IncidentVote {
    incidentId: string;
    userId: string;
    vote: VoteType;
    proofMediaId: string;
}
export interface Hero {
    id: string;
    userId: string;
    skills: string[];
    latitude: number;
    longitude: number;
    availability: boolean;
    reputation: number;
}
export type HeroTaskStatus = "ASSIGNED" | "ACCEPTED" | "RESPONDING" | "ARRIVED" | "RESOLVED";
export interface HeroTask {
    id: string;
    incidentId: string;
    heroId: string;
    status: HeroTaskStatus;
}
export interface CreditWallet {
    userId: string;
    availableCredits: number;
    lockedCredits: number;
}
export type CreditTransactionType = "STAKE" | "RELEASE" | "PENALTY" | "REWARD" | "REFUND";
export interface CreditTransaction {
    id: string;
    userId: string;
    incidentId?: string;
    amount: number;
    type: CreditTransactionType;
    createdAt: string;
}
export interface PublicService {
    id: string;
    name: string;
    category: string;
    phone: string;
    website: string;
}
export type EscalationStatus = "PENDING" | "SENT" | "FAILED";
export interface Escalation {
    id: string;
    incidentId: string;
    reason: string;
    status: EscalationStatus;
    sentAt?: string;
}
export type PrivacyChallengeStatus = "PENDING" | "MATCHED" | "NOT_MATCHED" | "EXPIRED";
export interface PrivacyChallenge {
    id: string;
    incidentId: string;
    userId: string;
    expiresAt: string;
    status: PrivacyChallengeStatus;
    matchConfidence?: number;
}
export interface NearbyUser {
    userId: string;
    latitude: number;
    longitude: number;
    distanceMeters: number;
}
export interface NearbyHero extends Hero {
    distanceMeters: number;
}
