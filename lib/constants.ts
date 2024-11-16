import { type LeadStatus } from '@/types/lead'

export const statusColors: Record<LeadStatus, "default" | "secondary" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  QUALIFIED: "secondary",
  PROPOSAL: "secondary",
  CONVERTED: "default",
  LOST: "destructive",
} as const; 