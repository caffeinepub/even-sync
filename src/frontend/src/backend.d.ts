import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Venue {
    name: string;
    capacity: bigint;
    location: string;
}
export interface Stats {
    upcomingEvents: bigint;
    totalEvents: bigint;
    totalVenues: bigint;
    totalVendors: bigint;
}
export interface Booking {
    status: BookingStatus;
    eventId: bigint;
    resourceId: bigint;
    isVendor: boolean;
}
export interface Event {
    status: EventStatus;
    date: bigint;
    name: string;
    description: string;
    venueName: string;
}
export interface Vendor {
    name: string;
    contactEmail: string;
    category: string;
    contactPhone: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum EventStatus {
    upcoming = "upcoming",
    cancelled = "cancelled",
    completed = "completed",
    ongoing = "ongoing"
}
export interface backendInterface {
    createBooking(booking: Booking): Promise<bigint>;
    createEvent(event: Event): Promise<bigint>;
    createVendor(vendor: Vendor): Promise<bigint>;
    createVenue(venue: Venue): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    deleteVendor(id: bigint): Promise<void>;
    deleteVenue(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getAllVenues(): Promise<Array<Venue>>;
    getBooking(id: bigint): Promise<Booking>;
    getBookingsForEvent(eventId: bigint): Promise<Array<Booking>>;
    getEvent(id: bigint): Promise<Event>;
    getStats(): Promise<Stats>;
    getVendor(id: bigint): Promise<Vendor>;
    getVenue(id: bigint): Promise<Venue>;
    updateEvent(id: bigint, event: Event): Promise<void>;
    updateVendor(id: bigint, vendor: Vendor): Promise<void>;
    updateVenue(id: bigint, venue: Venue): Promise<void>;
}
