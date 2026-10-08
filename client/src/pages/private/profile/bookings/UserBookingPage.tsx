import { useEffect, useState } from "react";
import PageTitle from "../../../../components/PageTitle";
import { message, Table, Tag, Button, Popconfirm } from "antd";
import { getUserBookings, cancelBooking } from "../../../../apiservices/bookingService";
import { getDateTimeFormat, getDateFormat } from "../../../../helpers/dateTimeFormat";
import { useNavigate } from "react-router-dom";

interface BookingType {
  _id: string;
  event: {
    _id: string;
    name: string;
    date: string;
    time: string;
    address: string;
    city: string;
  };
  ticketType: string;
  ticketsCount: number;
  totalAmount: number;
  paymentId: string;
  status: string;
  createdAt: string;
}

function UserBookingPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking(id);
      message.success("Booking cancelled successfully");
      // Refresh the list
      getData();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Booking Reference",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (ref: string) => (
        <span className="font-mono text-sm font-semibold">{ref}</span>
      ),
    },
    {
      title: "Event Name",
      dataIndex: "event",
      key: "eventName",
      render: (event: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">{event?.name}</span>
          <span className="text-xs text-gray-500">
            {event?.address}, {event?.city}
          </span>
        </div>
      ),
    },
    {
      title: "Event Date & Time",
      dataIndex: "event",
      key: "eventDate",
      render: (event: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">
            {getDateFormat(event?.date)}
          </span>
          <span className="text-xs text-gray-500">{event?.time}</span>
        </div>
      ),
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
      render: (type: string) => (
        <Tag color="blue" className="uppercase">
          {type}
        </Tag>
      ),
    },
    {
      title: "Tickets",
      dataIndex: "ticketsCount",
      key: "ticketsCount",
      render: (count: number) => (
        <span className="font-semibold">{count} ticket(s)</span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-sm">{getDateTimeFormat(date)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "confirmed"
            ? "green"
            : status === "cancelled"
            ? "red"
            : "orange";
        return (
          <Tag color={color} className="uppercase">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BookingType) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => navigate(`/event/${record.event._id}`)}
          >
            View Event
          </Button>
          {record.status === "confirmed" && (
            <Popconfirm
              title="Cancel Booking"
              description="Are you sure you want to cancel this booking?"
              onConfirm={() => handleCancelBooking(record._id)}
              okText="Yes, Cancel"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger>
                Cancel
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="My Bookings" />
      {bookings.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded mt-5">
          <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
          <Button type="primary" onClick={() => navigate("/")}>
            Browse Events
          </Button>
        </div>
      ) : (
        <Table
          dataSource={bookings}
          columns={columns}
          loading={loading}
          rowKey="_id"
          className="mt-5"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default UserBookingPage;