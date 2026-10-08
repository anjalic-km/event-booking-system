const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const BookingModel = require("../models/bookingModel");
const EventModel = require("../models/eventModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// Get revenue analytics
router.get("/revenue-analytics", validateToken, async (req, res) => {
  try {
    const { startDate, endDate, eventId } = req.query;

    // Build query
    const query = { status: "confirmed" }; // Only confirmed bookings
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (eventId && eventId !== "all") {
      query.event = eventId;
    }

    // Fetch bookings with event details
    const bookings = await BookingModel.find(query)
      .populate("event", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalBookings = bookings.length;
    const totalTickets = bookings.reduce((sum, b) => sum + b.ticketsCount, 0);

    // Revenue by event
    const revenueByEvent = bookings.reduce((acc, booking) => {
      const eventName = booking.event?.name || "Unknown";
      if (!acc[eventName]) {
        acc[eventName] = { revenue: 0, bookings: 0, tickets: 0 };
      }
      acc[eventName].revenue += booking.totalAmount;
      acc[eventName].bookings += 1;
      acc[eventName].tickets += booking.ticketsCount;
      return acc;
    }, {});

    // Revenue by ticket type
    const revenueByTicketType = bookings.reduce((acc, booking) => {
      const ticketType = booking.ticketType;
      if (!acc[ticketType]) {
        acc[ticketType] = { revenue: 0, count: 0 };
      }
      acc[ticketType].revenue += booking.totalAmount;
      acc[ticketType].count += booking.ticketsCount;
      return acc;
    }, {});

    // Daily revenue (for charts)
    const dailyRevenue = bookings.reduce((acc, booking) => {
      const date = new Date(booking.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += booking.totalAmount;
      return acc;
    }, {});

    return res.json({
      summary: {
        totalRevenue,
        totalBookings,
        totalTickets,
        averageOrderValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      },
      revenueByEvent: Object.entries(revenueByEvent).map(([name, data]) => ({
        eventName: name,
        ...data,
      })),
      revenueByTicketType: Object.entries(revenueByTicketType).map(
        ([type, data]) => ({
          ticketType: type,
          ...data,
        })
      ),
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      bookings,
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Export report as Excel
router.get("/export-excel", validateToken, async (req, res) => {
  try {
    const { startDate, endDate, eventId } = req.query;

    const query = { status: "confirmed" };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (eventId && eventId !== "all") {
      query.event = eventId;
    }

    const bookings = await BookingModel.find(query)
      .populate("event", "name date time")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bookings Report");

    // Add header
    worksheet.columns = [
      { header: "Booking ID", key: "bookingId", width: 25 },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Event Name", key: "eventName", width: 25 },
      { header: "Event Date", key: "eventDate", width: 15 },
      { header: "Ticket Type", key: "ticketType", width: 15 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Booked On", key: "bookedOn", width: 18 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

    // Add data
    bookings.forEach((booking) => {
      worksheet.addRow({
        bookingId: booking.paymentId,
        customerName: booking.user?.name || "N/A",
        email: booking.user?.email || "N/A",
        eventName: booking.event?.name || "N/A",
        eventDate: booking.event?.date || "N/A",
        ticketType: booking.ticketType,
        quantity: booking.ticketsCount,
        amount: `$${booking.totalAmount.toFixed(2)}`,
        bookedOn: new Date(booking.createdAt).toLocaleDateString(),
      });
    });

    // Add summary
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow([
      "TOTAL",
      "",
      "",
      "",
      "",
      "",
      bookings.reduce((sum, b) => sum + b.ticketsCount, 0),
      `$${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}`,
    ]);
    summaryRow.font = { bold: true };

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bookings-report-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Export report as PDF
router.get("/export-pdf", validateToken, async (req, res) => {
  try {
    const { startDate, endDate, eventId } = req.query;

    const query = { status: "confirmed" };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (eventId && eventId !== "all") {
      query.event = eventId;
    }

    const bookings = await BookingModel.find(query)
      .populate("event", "name date")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bookings-report-${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Bookings Revenue Report", { align: "center" });
    doc.moveDown();

    // Date range
    if (startDate && endDate) {
      doc
        .fontSize(12)
        .text(
          `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
          { align: "center" }
        );
      doc.moveDown();
    }

    // Summary
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTickets = bookings.reduce((sum, b) => sum + b.ticketsCount, 0);

    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(11).text(`Total Bookings: ${bookings.length}`);
    doc.text(`Total Tickets Sold: ${totalTickets}`);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    doc.moveDown();

    // Table header
    doc.fontSize(10);
    const tableTop = doc.y;
    doc.text("Customer", 50, tableTop);
    doc.text("Event", 150, tableTop);
    doc.text("Tickets", 300, tableTop);
    doc.text("Amount", 370, tableTop);
    doc.text("Date", 450, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Table rows
    let yPosition = tableTop + 25;
    bookings.slice(0, 30).forEach((booking) => {
      // Limit to 30 for PDF
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc.text(booking.user?.name || "N/A", 50, yPosition, { width: 90 });
      doc.text(booking.event?.name || "N/A", 150, yPosition, { width: 140 });
      doc.text(booking.ticketsCount.toString(), 300, yPosition);
      doc.text(`$${booking.totalAmount.toFixed(2)}`, 370, yPosition);
      doc.text(
        new Date(booking.createdAt).toLocaleDateString(),
        450,
        yPosition
      );

      yPosition += 20;
    });

    if (bookings.length > 30) {
      doc.moveDown();
      doc.text(`... and ${bookings.length - 30} more bookings`);
    }

    doc.end();
  } catch (error) {
    console.error("Export PDF error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;