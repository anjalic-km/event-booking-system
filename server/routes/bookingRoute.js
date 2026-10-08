const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const BookingModel = require("../models/bookingModel");
const EventModel = require("../models/eventModel");
const UserModel = require("../models/userModel");
const sendEmail = require("../helpers/sendEmail");
const { 
  getBookingConfirmationEmailTemplate, 
  getBookingCancellationEmailTemplate 
} = require("../helpers/emailTemplates");

router.post("/create-booking", validateToken, async (req, res) => {
  try {
    req.body.user = req.user._id;

    if (!req.body.event || !req.body.ticketType || !req.body.ticketsCount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await EventModel.findById(req.body.event);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tickets = event.tickets || [];
    const selectedTicket = tickets.find(
      (ticket) => ticket.name === req.body.ticketType
    );

    if (!selectedTicket) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    const requestedCount = Number(req.body.ticketsCount);
    if (requestedCount > selectedTicket.limit) {
      return res.status(400).json({
        message: `Only ${selectedTicket.limit} tickets available for ${selectedTicket.name}`,
      });
    }

    const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    req.body.paymentId = bookingReference;
    req.body.status = "confirmed";

    const booking = await BookingModel.create(req.body);

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.name === req.body.ticketType) {
        return {
          ...ticket,
          limit: ticket.limit - requestedCount,
        };
      }
      return ticket;
    });

    await EventModel.findByIdAndUpdate(req.body.event, {
      tickets: updatedTickets,
    });

    const populatedBooking = await BookingModel.findById(booking._id)
      .populate("event");

    // Send confirmation email
    try {
      const emailTemplate = getBookingConfirmationEmailTemplate({
        userName: user.name,
        eventName: event.name,
        eventDate: new Date(event.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        eventTime: event.time,
        eventAddress: event.address,
        eventCity: event.city,
        ticketType: booking.ticketType,
        ticketsCount: booking.ticketsCount,
        totalAmount: booking.totalAmount,
        bookingReference: bookingReference,
      });

      await sendEmail({
        email: user.email,
        subject: `🎉 Booking Confirmed - ${event.name}`,
        text: `Your booking for ${event.name} has been confirmed. Booking Reference: ${bookingReference}`,
        html: emailTemplate,
      });

      console.log(`Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return res.status(201).json({
      message: "Booking confirmed successfully!",
      booking: populatedBooking,
      bookingReference,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-user-bookings", validateToken, async (req, res) => {
  try {
    const bookings = await BookingModel.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    return res.json({ data: bookings });
  } catch (error) {
    console.error("Get user bookings error:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-all-bookings", validateToken, async (req, res) => {
  try {
    console.log("Fetching all bookings for admin...");
    
    const bookings = await BookingModel.find()
      .populate("event")
      .populate({
        path: "user",
        select: "name email"
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings`);
    
    return res.json({ data: bookings });
  } catch (error) {
    console.error("Get all bookings error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

router.get("/get-booking/:id", validateToken, async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id)
      .populate("event");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ data: booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/cancel-booking/:id", validateToken, async (req, res) => {
  try {
    // First, get the booking with populated event
    const booking = await BookingModel.findById(req.params.id)
      .populate("event");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Get user details for email
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store event details before updating
    const eventDetails = {
      id: booking.event._id,
      name: booking.event.name,
      date: booking.event.date,
      time: booking.event.time,
      address: booking.event.address,
      city: booking.event.city,
    };

    // Update ticket availability
    const event = await EventModel.findById(booking.event._id);
    if (event) {
      const updatedTickets = event.tickets.map((ticket) => {
        if (ticket.name === booking.ticketType) {
          return {
            ...ticket,
            limit: ticket.limit + booking.ticketsCount,
          };
        }
        return ticket;
      });

      await EventModel.findByIdAndUpdate(booking.event._id, {
        tickets: updatedTickets,
      });
    }

    // Update booking status to cancelled
    await BookingModel.findByIdAndUpdate(booking._id, { status: "cancelled" });

    // Send cancellation email
    try {
      console.log("Preparing to send cancellation email...");
      console.log("User email:", user.email);
      console.log("Event name:", eventDetails.name);
      
      const emailTemplate = getBookingCancellationEmailTemplate({
        userName: user.name,
        eventName: eventDetails.name,
        eventDate: new Date(eventDetails.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        eventTime: eventDetails.time,
        ticketType: booking.ticketType,
        ticketsCount: booking.ticketsCount,
        totalAmount: booking.totalAmount,
        bookingReference: booking.paymentId,
      });

      await sendEmail({
        email: user.email,
        subject: `Booking Cancelled - ${eventDetails.name}`,
        text: `Your booking for ${eventDetails.name} has been cancelled. Booking Reference: ${booking.paymentId}`,
        html: emailTemplate,
      });

      console.log(`✅ Cancellation email sent successfully to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Failed to send cancellation email:");
      console.error("Error message:", emailError.message);
      console.error("Error stack:", emailError.stack);
      // Don't fail the cancellation if email fails
    }

    return res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;