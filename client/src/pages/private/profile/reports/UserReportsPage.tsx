import { useEffect, useState } from "react";
import { message, Table, Tabs } from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getUserBookings } from "../../../../apiservices/bookingService";
import { DollarSign, ShoppingCart, Ticket, Calendar} from "lucide-react";
import { getDateTimeFormat } from "../../../../helpers/dateTimeFormat";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function UserReportsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      const bookingsData = response.data || [];
      setBookings(bookingsData);
      calculateAnalytics(bookingsData);
    } catch (error) {
      message.error("Failed to load your booking data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (bookingsData: any[]) => {
    const confirmedBookings = bookingsData.filter(b => b.status === "confirmed");
    
    // Summary stats
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTickets = confirmedBookings.reduce((sum, b) => sum + b.ticketsCount, 0);
    const averageOrderValue = confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0;

    // Upcoming vs Past events
    const now = new Date();
    const upcomingEvents = confirmedBookings.filter(b => {
      const eventDate = new Date(b.event?.date);
      return eventDate > now;
    }).length;

    // Spending by event
    const spendingByEvent = confirmedBookings.reduce((acc: any, booking) => {
      const eventName = booking.event?.name || "Unknown";
      if (!acc[eventName]) {
        acc[eventName] = { eventName, amount: 0, tickets: 0 };
      }
      acc[eventName].amount += booking.totalAmount;
      acc[eventName].tickets += booking.ticketsCount;
      return acc;
    }, {});

    // Spending by ticket type
    const spendingByTicketType = confirmedBookings.reduce((acc: any, booking) => {
      const type = booking.ticketType;
      if (!acc[type]) {
        acc[type] = { ticketType: type, amount: 0, count: 0 };
      }
      acc[type].amount += booking.totalAmount;
      acc[type].count += booking.ticketsCount;
      return acc;
    }, {});

    // Monthly spending (last 6 months)
    const monthlySpending: any = {};
    confirmedBookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlySpending[monthYear]) {
        monthlySpending[monthYear] = 0;
      }
      monthlySpending[monthYear] += booking.totalAmount;
    });

    setAnalytics({
      summary: {
        totalSpent: totalRevenue,
        totalBookings: confirmedBookings.length,
        totalTickets,
        averageOrderValue,
        upcomingEvents,
        cancelledBookings: bookingsData.filter(b => b.status === "cancelled").length,
      },
      spendingByEvent: Object.values(spendingByEvent),
      spendingByTicketType: Object.values(spendingByTicketType),
      monthlySpending: Object.entries(monthlySpending).map(([month, amount]) => ({
        month,
        amount,
      })),
    });
  };

  const bookingsColumns = [
    {
      title: "Booking ID",
      dataIndex: "paymentId",
      key: "paymentId",
      width: 150,
    },
    {
      title: "Event",
      key: "event",
      render: (_: any, record: any) => record.event?.name || "N/A",
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
      width: 120,
    },
    {
      title: "Qty",
      dataIndex: "ticketsCount",
      key: "ticketsCount",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <span style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          background: status === "confirmed" ? "#dcfce7" : "#fee2e2",
          color: status === "confirmed" ? "#16a34a" : "#dc2626"
        }}>
          {status === "confirmed" ? "Confirmed" : "Cancelled"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => getDateTimeFormat(date),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>Loading your reports...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>No data available</div>
      </div>
    );
  }

  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: (
        <div>
          {/* KPI Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Total Spent</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                    ${analytics.summary.totalSpent.toFixed(2)}
                  </div>
                </div>
                <DollarSign size={36} style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>My Bookings</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                    {analytics.summary.totalBookings}
                  </div>
                </div>
                <ShoppingCart size={36} style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Tickets Owned</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                    {analytics.summary.totalTickets}
                  </div>
                </div>
                <Ticket size={36} style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Upcoming Events</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                    {analytics.summary.upcomingEvents}
                  </div>
                </div>
                <Calendar size={36} style={{ opacity: 0.8 }} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            {/* Spending by Event */}
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
                My Spending by Event
              </h3>
              {analytics.spendingByEvent.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.spendingByEvent}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="eventName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                  No spending data yet
                </div>
              )}
            </div>

            {/* Ticket Type Distribution */}
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
                Ticket Type Preferences
              </h3>
              {analytics.spendingByTicketType.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.spendingByTicketType}
                      dataKey="count"
                      nameKey="ticketType"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics.spendingByTicketType.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                  No ticket data yet
                </div>
              )}
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
              My Spending Over Time
            </h3>
            {analytics.monthlySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#667eea"
                    strokeWidth={3}
                    dot={{ fill: '#667eea', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                No spending trend data yet
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "My Bookings",
      children: (
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              All My Bookings ({bookings.length})
            </h3>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              {analytics.summary.cancelledBookings} cancelled
            </div>
          </div>
          <Table
            dataSource={bookings}
            columns={bookingsColumns}
            rowKey="_id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1000 }}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Statistics",
      children: (
        <div>
          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Average Per Booking
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea" }}>
                ${analytics.summary.averageOrderValue.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                Total spent ÷ Total bookings
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Success Rate
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>
                {bookings.length > 0 
                  ? ((analytics.summary.totalBookings / bookings.length) * 100).toFixed(1)
                  : 0}%
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                Confirmed bookings rate
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Events Attended
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>
                {analytics.spendingByEvent.length}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                Unique events booked
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
              Event-wise Breakdown
            </h3>
            <Table
              dataSource={analytics.spendingByEvent}
              columns={[
                {
                  title: "Event Name",
                  dataIndex: "eventName",
                  key: "eventName",
                },
                {
                  title: "Total Spent",
                  dataIndex: "amount",
                  key: "amount",
                  render: (val: number) => (
                    <span style={{ color: "#10b981", fontWeight: "600" }}>
                      ${val.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: "Tickets Purchased",
                  dataIndex: "tickets",
                  key: "tickets",
                },
              ]}
              rowKey="eventName"
              pagination={false}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>
          My Reports
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          View your personal booking analytics and spending insights
        </p>
      </div>

      <Tabs
        items={tabItems}
        size="large"
      />
    </div>
  );
}

export default UserReportsPage;