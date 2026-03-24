import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";

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

  type Stats = {
    totalEvents : Nat;
    totalVenues : Nat;
    totalVendors : Nat;
    upcomingEvents : Nat;
  };

  // Comparisons for sorting
  module Event {
    public func compareByDate(e1 : Event, e2 : Event) : Order.Order {
      Int.compare(e1.date, e2.date);
    };
  };

  // Persistent storage
  var nextEventId = 1;
  var nextVenueId = 1;
  var nextVendorId = 1;

  let events = Map.empty<Nat, Event>();
  let venues = Map.empty<Nat, Venue>();
  let vendors = Map.empty<Nat, Vendor>();
  let bookings = Map.empty<Nat, Booking>();

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

  // Bookings
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

  // Dashboard Stats
  public query ({ caller }) func getStats() : async Stats {
    let totalEvents = events.size();
    let totalVenues = venues.size();
    let totalVendors = vendors.size();
    let upcomingEvents = events.values().toArray().filter(
      func(e) { e.status == #upcoming }
    ).size();
    {
      totalEvents;
      totalVenues;
      totalVendors;
      upcomingEvents;
    };
  };
};
