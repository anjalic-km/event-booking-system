import { useEffect, useState } from "react";
import PageTitle from "../../../../components/PageTitle";
import { message, Table, Tag } from "antd";
import { getAllBookings } from "../../../../apiservices/bookingService";
import { getDateTimeFormat, getDateFormat } from "../../../../helpers/dateTimeFormat";

interface BookingType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
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

function AdminBookingPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
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
        <span className="font-mono text-xs font-semibold">{ref}</span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "customer",
      render: (user: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">{user?.name}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
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
          <span className="font-semibold">{getDateFormat(event?.date)}</span>
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
  ];

  // Calculate summary statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div>
      <PageTitle title="All Bookings" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <h2 className="text-2xl font-bold text-blue-700">{stats.total}</h2>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <p className="text-sm text-gray-600">Confirmed</p>
          <h2 className="text-2xl font-bold text-green-700">
            {stats.confirmed}
          </h2>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-sm text-gray-600">Cancelled</p>
          <h2 className="text-2xl font-bold text-red-700">{stats.cancelled}</h2>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <h2 className="text-2xl font-bold text-purple-700">
            ${stats.totalRevenue.toFixed(2)}
          </h2>
        </div>
      </div>

      {bookings.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded mt-5">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <Table
          dataSource={bookings}
          columns={columns}
          loading={loading}
          rowKey="_id"
          className="mt-5"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1200 }}
        />
      )}
    </div>
  );
}

export default AdminBookingPage;