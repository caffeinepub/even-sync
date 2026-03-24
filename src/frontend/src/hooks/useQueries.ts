import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  Booth,
  CrowdSession,
  Document,
  Event,
  Payment,
  Vendor,
  Venue,
} from "../backend.d";
import {
  BookingStatus,
  DocumentStatus,
  EventStatus,
  PaymentStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return {
          upcomingEvents: 0n,
          totalEvents: 0n,
          totalVenues: 0n,
          totalVendors: 0n,
          totalBooths: 0n,
          occupiedBooths: 0n,
          totalVisitorsToday: 0n,
          totalPayments: 0n,
        };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (event: Event) => actor!.createEvent(event),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: bigint; event: Event }) =>
      actor!.updateEvent(id, event),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGetAllVenues() {
  const { actor, isFetching } = useActor();
  return useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVenues();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (venue: Venue) => actor!.createVenue(venue),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["venues"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, venue }: { id: bigint; venue: Venue }) =>
      actor!.updateVenue(id, venue),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venues"] }),
  });
}

export function useDeleteVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteVenue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["venues"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGetAllVendors() {
  const { actor, isFetching } = useActor();
  return useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vendor: Vendor) => actor!.createVendor(vendor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendor }: { id: bigint; vendor: Vendor }) =>
      actor!.updateVendor(id, vendor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
}

export function useDeleteVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteVendor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (booking: Booking) => actor!.createBooking(booking),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// Booth hooks
export function useGetAllBooths() {
  const { actor, isFetching } = useActor();
  return useQuery<Booth[]>({
    queryKey: ["booths"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBooths();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooth() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (booth: Booth) => actor!.createBooth(booth),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["booths"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAssignBooth() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendorName }: { id: bigint; vendorName: string }) =>
      actor!.assignBooth(id, vendorName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths"] }),
  });
}

// Payment hooks
export function useGetAllPayments() {
  const { actor, isFetching } = useActor();
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payment: Payment) => actor!.createPayment(payment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: PaymentStatus }) =>
      actor!.updatePaymentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

// Document hooks
export function useGetAllDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDocument() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (document: Document) => actor!.createDocument(document),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useUpdateDocumentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: DocumentStatus }) =>
      actor!.updateDocumentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

// Crowd Session hooks
export function useGetAllCrowdSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<CrowdSession[]>({
    queryKey: ["crowdSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCrowdSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCrowdSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (session: CrowdSession) => actor!.addCrowdSession(session),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crowdSessions"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export { EventStatus, BookingStatus, DocumentStatus, PaymentStatus };
