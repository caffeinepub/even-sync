import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";



actor {
  // Types
  type EventStatus = {
    #upcoming;
    #ongoing;
    #completed;
    #cancelled;
  };

  type Event = {
    name : Text;
    date : Int;
    venueName : Text;
    status : EventStatus;
    description : Text;
  };

  type Venue = {
    name : Text;
    location : Text;
    capacity : Nat;
  };

  type Vendor = {
    name : Text;
    category : Text;
    contactEmail : Text;
    contactPhone : Text;
  };

  type BookingStatus = {
    #confirmed;
    #pending;
    #cancelled;
  };

  type Booking = {
    eventId : Nat;
    resourceId : Nat;
    isVendor : Bool;
    status : BookingStatus;
  };

  // Booth Types
  type BoothSize = {
    #small;
    #medium;
    #large;
  };

  type BoothStatus = {
    #available;
    #occupied;
    #reserved;
  };

  type Booth = {
    number : Nat;
    size : BoothSize;
    zone : Text;
    status : BoothStatus;
    assignedVendor : ?Text;
  };

  // Payment Types
  type Currency = {
    #usd;
    #eur;
    #gbp;
    #inr;
    #btc;
    #eth;
    #icp;
    #other : Text;
  };

  type PaymentStatus = {
    #paid;
    #pending;
    #overdue;
  };

  type Payment = {
    vendorId : Nat;
    amount : Float;
    currency : Currency;
    status : PaymentStatus;
    dueDate : Int;
  };

  // Document Types
  type DocumentType = {
    #license;
    #id;
    #permit;
    #other : Text;
  };

  type DocumentStatus = {
    #pending;
    #verified;
    #rejected;
  };

  type Document = {
    vendorId : Nat;
    docType : DocumentType;
    fileName : Text;
    status : DocumentStatus;
  };

  // Crowd Monitoring Types
  type SafetyStatus = {
    #normal;
    #caution;
    #critical;
  };

  type CrowdSession = {
    timestamp : Int;
    visitorCount : Nat;
    zone : Text;
    occupancyPercentage : Float;
    safetyStatus : SafetyStatus;
  };

  // Stats
  type Stats = {
    totalEvents : Nat;
    totalVenues : Nat;
    totalVendors : Nat;
    totalBooths : Nat;
    occupiedBooths : Nat;
    totalVisitorsToday : Nat;
    totalPayments : Nat;
    upcomingEvents : Nat;
  };

  // Persistent storage
  var nextEventId = 1;
  var nextVenueId = 1;
  var nextVendorId = 1;
  var nextBoothId = 1;
  var nextPaymentId = 1;
  var nextDocumentId = 1;
  var nextCrowdSessionId = 1;

  let events = Map.empty<Nat, Event>();
  let venues = Map.empty<Nat, Venue>();
  let vendors = Map.empty<Nat, Vendor>();
  let bookings = Map.empty<Nat, Booking>();

  // New modules persistent storage
  let booths = Map.empty<Nat, Booth>();
  let payments = Map.empty<Nat, Payment>();
  let documents = Map.empty<Nat, Document>();
  let crowdSessions = Map.empty<Nat, CrowdSession>();

  // Events
  public shared ({ caller }) func createEvent(event : Event) : async Nat {
    let id = nextEventId;
    nextEventId += 1;
    events.add(id, event);
    id;
  };

  public query ({ caller }) func getEvent(id : Nat) : async Event {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  public query ({ caller }) func getUpcomingEvents() : async [Event] {
    events.values().toArray().filter(func(e) { e.status == #upcoming });
  };

  public shared ({ caller }) func updateEvent(id : Nat, event : Event) : async () {
    if (not events.containsKey(id)) { Runtime.trap("Event not found") };
    events.add(id, event);
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not events.containsKey(id)) { Runtime.trap("Event not found") };
    events.remove(id);
  };

  // Venues
  public shared ({ caller }) func createVenue(venue : Venue) : async Nat {
    let id = nextVenueId;
    nextVenueId += 1;
    venues.add(id, venue);
    id;
  };

  public query ({ caller }) func getVenue(id : Nat) : async Venue {
    switch (venues.get(id)) {
      case (null) { Runtime.trap("Venue not found") };
      case (?venue) { venue };
    };
  };

  public query ({ caller }) func getAllVenues() : async [Venue] {
    venues.values().toArray();
  };

  public shared ({ caller }) func updateVenue(id : Nat, venue : Venue) : async () {
    if (not venues.containsKey(id)) { Runtime.trap("Venue not found") };
    venues.add(id, venue);
  };

  public shared ({ caller }) func deleteVenue(id : Nat) : async () {
    if (not venues.containsKey(id)) { Runtime.trap("Venue not found") };
    venues.remove(id);
  };

  // Vendors
  public shared ({ caller }) func createVendor(vendor : Vendor) : async Nat {
    let id = nextVendorId;
    nextVendorId += 1;
    vendors.add(id, vendor);
    id;
  };

  public query ({ caller }) func getVendor(id : Nat) : async Vendor {
    switch (vendors.get(id)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    vendors.values().toArray();
  };

  public shared ({ caller }) func updateVendor(id : Nat, vendor : Vendor) : async () {
    if (not vendors.containsKey(id)) { Runtime.trap("Vendor not found") };
    vendors.add(id, vendor);
  };

  public shared ({ caller }) func deleteVendor(id : Nat) : async () {
    if (not vendors.containsKey(id)) { Runtime.trap("Vendor not found") };
    vendors.remove(id);
  };

  // Bookings (resource / vendor bookings)
  public shared ({ caller }) func createBooking(booking : Booking) : async Nat {
    let id = bookings.size();
    bookings.add(id, booking);
    id;
  };

  public query ({ caller }) func getBooking(id : Nat) : async Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public query ({ caller }) func getBookingsForEvent(eventId : Nat) : async [Booking] {
    bookings.values().toArray().filter(func(b) { b.eventId == eventId });
  };

  // ---- New Modules ----

  // Booth Management
  public shared ({ caller }) func createBooth(booth : Booth) : async Nat {
    let id = nextBoothId;
    nextBoothId += 1;
    booths.add(id, booth);
    id;
  };

  public query ({ caller }) func getBooth(id : Nat) : async Booth {
    switch (booths.get(id)) {
      case (null) { Runtime.trap("Booth not found") };
      case (?booth) { booth };
    };
  };

  public query ({ caller }) func getAllBooths() : async [Booth] {
    booths.values().toArray();
  };

  public shared ({ caller }) func updateBooth(id : Nat, booth : Booth) : async () {
    if (not booths.containsKey(id)) { Runtime.trap("Booth not found") };
    booths.add(id, booth);
  };

  public shared ({ caller }) func assignBooth(id : Nat, vendorName : Text) : async () {
    switch (booths.get(id)) {
      case (null) { Runtime.trap("Booth not found") };
      case (?booth) {
        booths.add(id, { booth with status = #occupied; assignedVendor = ?vendorName });
      };
    };
  };

  // Payment Tracking
  public shared ({ caller }) func createPayment(payment : Payment) : async Nat {
    let id = nextPaymentId;
    nextPaymentId += 1;
    payments.add(id, payment);
    id;
  };

  public query ({ caller }) func getPayment(id : Nat) : async Payment {
    switch (payments.get(id)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) { payment };
    };
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    payments.values().toArray();
  };

  public shared ({ caller }) func updatePaymentStatus(id : Nat, status : PaymentStatus) : async () {
    switch (payments.get(id)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) {
        payments.add(id, { payment with status });
      };
    };
  };

  // Document Verification
  public shared ({ caller }) func createDocument(document : Document) : async Nat {
    let id = nextDocumentId;
    nextDocumentId += 1;
    documents.add(id, document);
    id;
  };

  public query ({ caller }) func getDocument(id : Nat) : async Document {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) { document };
    };
  };

  public query ({ caller }) func getAllDocuments() : async [Document] {
    documents.values().toArray();
  };

  public shared ({ caller }) func updateDocumentStatus(id : Nat, status : DocumentStatus) : async () {
    switch (documents.get(id)) {
      case (null) { Runtime.trap("Document not found") };
      case (?document) {
        documents.add(id, { document with status });
      };
    };
  };

  // Crowd Monitoring
  public shared ({ caller }) func addCrowdSession(session : CrowdSession) : async () {
    crowdSessions.add(nextCrowdSessionId, session);
    nextCrowdSessionId += 1;
  };

  public query ({ caller }) func getAllCrowdSessions() : async [CrowdSession] {
    crowdSessions.values().toArray();
  };

  public query ({ caller }) func getCrowdSessionsByZone(zone : Text) : async [CrowdSession] {
    crowdSessions.values().toArray().filter(func(s) { s.zone == zone });
  };

  // Dashboard Stats
  public query ({ caller }) func getStats() : async Stats {
    let totalEvents = events.size();
    let totalVenues = venues.size();
    let totalVendors = vendors.size();
    let totalBooths = booths.size();
    let occupiedBooths = booths.values().toArray().filter(func(b) { b.status == #occupied }).size();
    let totalVisitorsToday = crowdSessions.values().toArray().filter(
      func(s) { Time.now() - s.timestamp < (24 * 60 * 60 * 1_000_000_000) }
    ).size();
    let totalPayments = payments.size();
    let upcomingEvents = events.values().toArray().filter(func(e) { e.status == #upcoming }).size();

    {
      totalEvents;
      totalVenues;
      totalVendors;
      totalBooths;
      occupiedBooths;
      totalVisitorsToday;
      totalPayments;
      upcomingEvents;
    };
  };
};
