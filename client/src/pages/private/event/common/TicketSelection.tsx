import { useState } from "react";
import type { eventType, userType } from "../../../../interfaces";
import { Button, Input, message, Modal } from "antd";
import { createBooking } from "../../../../apiservices/bookingService";
import { useNavigate } from "react-router-dom";

interface TicketType {
  name: string;
  price: number;
  limit: number;
}

interface TicketSelectionProps {
  eventData: eventType;
  user: userType;
}

function TicketSelection({ eventData }: TicketSelectionProps) {
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [maxCount, setMaxCount] = useState<number>(0);
  const [selectedTicketsCount, setSelectedTicketsCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ticketTypes: TicketType[] = Array.isArray(eventData.tickets)
    ? eventData.tickets
    : [];

  const selectedTicketPrice =
    ticketTypes.find(
      (ticketType: TicketType) => ticketType.name === selectedTicketType,
    )?.price || 0;

  const totalAmount = selectedTicketPrice * selectedTicketsCount;

  const handleTicketCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    if (count < 1) {
      setSelectedTicketsCount(1);
    } else if (count > maxCount) {
      message.warning(`Maximum ${maxCount} tickets available for this type`);
      setSelectedTicketsCount(maxCount);
    } else {
      setSelectedTicketsCount(count);
    }
  };

  const handleBookNow = async () => {
    if (!selectedTicketType) {
      message.error("Please select a ticket type");
      return;
    }
    if (selectedTicketsCount < 1 || selectedTicketsCount > maxCount) {
      message.error(`Please select between 1 and ${maxCount} tickets`);
      return;
    }

    Modal.confirm({
      title: "Confirm Booking",
      content: (
        <div>
          <p>
            <strong>Event:</strong> {eventData.name}
          </p>
          <p>
            <strong>Ticket Type:</strong> {selectedTicketType}
          </p>
          <p>
            <strong>Quantity:</strong> {selectedTicketsCount} ticket(s)
          </p>
          <p>
            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
          </p>
          <p className="mt-3 text-gray-600">
            <strong>Payment Method:</strong> Cash on Arrival
          </p>
          <p className="text-sm text-gray-500">
            Please bring cash to pay at the event entrance.
          </p>
        </div>
      ),
      okText: "Confirm Booking",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const bookingData = {
            event: eventData._id,
            ticketType: selectedTicketType,
            ticketsCount: selectedTicketsCount,
            totalAmount: totalAmount,
          };
          const response = await createBooking(bookingData);
          message.success({
            content: `Booking confirmed! Reference: ${response.bookingReference}`,
            duration: 5,
          });
          navigate("/bookings");
        } catch (error: any) {
          message.error(
            error.response?.data?.message || "Failed to create booking",
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="p-5 bg-gray-100 rounded text-center">
        <p className="text-gray-500">No tickets available for this event</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-bold text-gray-700 mb-3">
          Select Ticket Type
        </h1>
        <div className="flex flex-wrap gap-5">
          {ticketTypes.map((ticketType: TicketType, index: number) => {
            const isAvailable = ticketType.limit > 0;
            return (
              <div
                key={index}
                className={`p-4 border rounded-lg lg:w-96 w-full transition-all ${
                  !isAvailable
                    ? "opacity-50 cursor-not-allowed bg-gray-200"
                    : selectedTicketType === ticketType.name
                      ? "border-primary border-2 bg-blue-50 cursor-pointer"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                }`}
                onClick={() => {
                  if (isAvailable) {
                    setSelectedTicketType(ticketType.name);
                    setMaxCount(ticketType.limit);
                    setSelectedTicketsCount(1);
                  }
                }}
              >
                <h1 className="text-sm text-gray-700 font-semibold uppercase mb-2">
                  {ticketType.name}
                  {!isAvailable && (
                    <span className="ml-2 text-red-500 text-xs">
                      (SOLD OUT)
                    </span>
                  )}
                </h1>
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold text-gray-900">
                    ${ticketType.price}
                  </h1>
                  <h1 className="text-xs text-gray-600">
                    {ticketType.limit} tickets left
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTicketType && (
        <>
          <div>
            <h1 className="text-lg font-bold text-gray-700 mb-3">
              Select Number of Tickets
            </h1>
            <Input
              type="number"
              min={1}
              max={maxCount}
              value={selectedTicketsCount}
              className="w-full md:w-96"
              onChange={(e) => handleTicketCountChange(e.target.value)}
              placeholder={`Enter quantity (max: ${maxCount})`}
            />
            <p className="text-xs text-gray-500 mt-2">
              Maximum {maxCount} tickets available for {selectedTicketType}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 border border-gray-300 rounded p-5 gap-5">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Total Amount</span>
              <h1 className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </h1>
              <span className="text-xs text-gray-500">
                {selectedTicketsCount} x {selectedTicketType} @ $
                {selectedTicketPrice}
              </span>
              <span className="text-xs text-blue-600 mt-2">
                💵 Payment: Cash on Arrival
              </span>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleBookNow}
              loading={loading}
              disabled={!selectedTicketType || selectedTicketsCount < 1}
            >
              Book Now
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default TicketSelection;
