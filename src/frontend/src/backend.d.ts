import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DocumentType = {
    __kind__: "id";
    id: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "permit";
    permit: null;
} | {
    __kind__: "license";
    license: null;
};
export type Currency = {
    __kind__: "btc";
    btc: null;
} | {
    __kind__: "eth";
    eth: null;
} | {
    __kind__: "eur";
    eur: null;
} | {
    __kind__: "gbp";
    gbp: null;
} | {
    __kind__: "icp";
    icp: null;
} | {
    __kind__: "inr";
    inr: null;
} | {
    __kind__: "usd";
    usd: null;
} | {
    __kind__: "other";
    other: string;
};
export interface Venue {
    name: string;
    capacity: bigint;
    location: string;
}
export interface Event {
    status: EventStatus;
    date: bigint;
    name: string;
    description: string;
    venueName: string;
}
export interface Stats {
    totalBooths: bigint;
    upcomingEvents: bigint;
    totalEvents: bigint;
    totalPayments: bigint;
    totalVenues: bigint;
    totalVisitorsToday: bigint;
    occupiedBooths: bigint;
    totalVendors: bigint;
}
export interface Payment {
    status: PaymentStatus;
    dueDate: bigint;
    currency: Currency;
    vendorId: bigint;
    amount: number;
}
export interface Document {
    status: DocumentStatus;
    fileName: string;
    vendorId: bigint;
    docType: DocumentType;
}
export interface Booth {
    status: BoothStatus;
    assignedVendor?: string;
    size: BoothSize;
    zone: string;
    number: bigint;
}
export interface CrowdSession {
    safetyStatus: SafetyStatus;
    occupancyPercentage: number;
    zone: string;
    visitorCount: bigint;
    timestamp: bigint;
}
export interface Booking {
    status: BookingStatus;
    eventId: bigint;
    resourceId: bigint;
    isVendor: boolean;
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
export enum BoothSize {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum BoothStatus {
    occupied = "occupied",
    reserved = "reserved",
    available = "available"
}
export enum DocumentStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum EventStatus {
    upcoming = "upcoming",
    cancelled = "cancelled",
    completed = "completed",
    ongoing = "ongoing"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    overdue = "overdue"
}
export enum SafetyStatus {
    normal = "normal",
    caution = "caution",
    critical = "critical"
}
export interface backendInterface {
    addCrowdSession(session: CrowdSession): Promise<void>;
    assignBooth(id: bigint, vendorName: string): Promise<void>;
    createBooking(booking: Booking): Promise<bigint>;
    createBooth(booth: Booth): Promise<bigint>;
    createDocument(document: Document): Promise<bigint>;
    createEvent(event: Event): Promise<bigint>;
    createPayment(payment: Payment): Promise<bigint>;
    createVendor(vendor: Vendor): Promise<bigint>;
    createVenue(venue: Venue): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    deleteVendor(id: bigint): Promise<void>;
    deleteVenue(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllBooths(): Promise<Array<Booth>>;
    getAllCrowdSessions(): Promise<Array<CrowdSession>>;
    getAllDocuments(): Promise<Array<Document>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllPayments(): Promise<Array<Payment>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getAllVenues(): Promise<Array<Venue>>;
    getBooking(id: bigint): Promise<Booking>;
    getBookingsForEvent(eventId: bigint): Promise<Array<Booking>>;
    getBooth(id: bigint): Promise<Booth>;
    getCrowdSessionsByZone(zone: string): Promise<Array<CrowdSession>>;
    getDocument(id: bigint): Promise<Document>;
    getEvent(id: bigint): Promise<Event>;
    getPayment(id: bigint): Promise<Payment>;
    getStats(): Promise<Stats>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getVendor(id: bigint): Promise<Vendor>;
    getVenue(id: bigint): Promise<Venue>;
    updateBooth(id: bigint, booth: Booth): Promise<void>;
    updateDocumentStatus(id: bigint, status: DocumentStatus): Promise<void>;
    updateEvent(id: bigint, event: Event): Promise<void>;
    updatePaymentStatus(id: bigint, status: PaymentStatus): Promise<void>;
    updateVendor(id: bigint, vendor: Vendor): Promise<void>;
    updateVenue(id: bigint, venue: Venue): Promise<void>;
}
