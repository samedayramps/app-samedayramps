import { Prisma } from '@prisma/client'

export type MobilityAid = "wheelchair" | "walker" | "motorized scooter" | "other";
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'CONVERTED' | 'LOST';

export type Lead = Prisma.LeadGetPayload<Record<string, never>>; 