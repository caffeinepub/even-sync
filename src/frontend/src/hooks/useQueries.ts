import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, Event, Vendor, Venue } from "../backend.d";
import { BookingStatus, EventStatus } from "../backend.d";
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

export { EventStatus, BookingStatus };
