import { useEffect, useState } from "react";
import { message, Table, Tabs, Button } from "antd";
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
import { getRevenueAnalytics, exportExcel, exportPDF, exportCSV } from "../../../../apiservices/reportService";
import { DollarSign, ShoppingCart, Ticket, TrendingUp, Download, FileSpreadsheet, FileText} from "lucide-react";
import { getDateTimeFormat } from "../../../../helpers/dateTimeFormat";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getRevenueAnalytics({});
      setAnalytics(data);
    } catch (error) {
      message.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      message.loading("Generating Excel report...", 2);
      await exportExcel({});
      message.success("Excel report downloaded");
    } catch (error) {
      message.error("Failed to export Excel");
    }
  };

  const handleExportPDF = async () => {
    try {
      message.loading("Generating PDF report...", 2);
      await exportPDF({});
      message.success("PDF report downloaded");
    } catch (error) {
      message.error("Failed to export PDF");
    }
  };

  const handleExportCSV = () => {
    try {
      if (!analytics?.bookings) {
        message.warning("No data to export");
        return;
      }
      const csvData = analytics.bookings.map((booking: any) => ({
        "Booking ID": booking.paymentId,
        "Customer": booking.user?.name || "N/A",
        "Email": booking.user?.email || "N/A",
        "Event": booking.event?.name || "N/A",
        "Ticket Type": booking.ticketType,
        "Quantity": booking.ticketsCount,
        "Amount": booking.totalAmount,
        "Date": new Date(booking.createdAt).toLocaleDateString(),
      }));
      exportCSV(csvData, "bookings-report");
      message.success("CSV downloaded");
    } catch (error) {
      message.error("Failed to export CSV");
    }
  };

  const bookingsColumns = [
    {
      title: "Booking ID",
      dataIndex: "paymentId",
      key: "paymentId",
      width: 150,
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_: any, record: any) => record.user?.name || "N/A",
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
        <div>Loading analytics...</div>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Total Revenue</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    ${analytics.summary.totalRevenue.toFixed(2)}
                  </div>
                </div>
                <DollarSign size={40} style={{ opacity: 0.8 }} />
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
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Total Bookings</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    {analytics.summary.totalBookings}
                  </div>
                </div>
                <ShoppingCart size={40} style={{ opacity: 0.8 }} />
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
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Tickets Sold</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    {analytics.summary.totalTickets}
                  </div>
                </div>
                <Ticket size={40} style={{ opacity: 0.8 }} />
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
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Avg Order Value</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    ${analytics.summary.averageOrderValue.toFixed(2)}
                  </div>
                </div>
                <TrendingUp size={40} style={{ opacity: 0.8 }} />
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
            {/* Revenue by Event */}
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
                Revenue by Event
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.revenueByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eventName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ticket Distribution */}
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
                Bookings Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.revenueByEvent}
                    dataKey="bookings"
                    nameKey="eventName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics.revenueByEvent.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
              Revenue Trend Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Bookings",
      children: (
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              All Bookings ({analytics.bookings.length})
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button icon={<FileSpreadsheet size={16} />} onClick={handleExportExcel}>
                Excel
              </Button>
              <Button icon={<FileText size={16} />} onClick={handleExportPDF}>
                PDF
              </Button>
              <Button icon={<Download size={16} />} onClick={handleExportCSV}>
                CSV
              </Button>
            </div>
          </div>
          <Table
            dataSource={analytics.bookings}
            columns={bookingsColumns}
            rowKey="_id"
            pagination={{ pageSize: 15, showSizeChanger: true }}
            scroll={{ x: 1000 }}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Event Performance",
      children: (
        <div>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
              Event Performance Metrics
            </h3>
            <Table
              dataSource={analytics.revenueByEvent}
              columns={[
                {
                  title: "Event Name",
                  dataIndex: "eventName",
                  key: "eventName",
                  render: (text: string) => <strong>{text}</strong>,
                },
                {
                  title: "Revenue",
                  dataIndex: "revenue",
                  key: "revenue",
                  render: (val: number) => (
                    <span style={{ color: "#10b981", fontWeight: "600" }}>
                      ${val.toFixed(2)}
                    </span>
                  ),
                  sorter: (a: any, b: any) => a.revenue - b.revenue,
                },
                {
                  title: "Bookings",
                  dataIndex: "bookings",
                  key: "bookings",
                  sorter: (a: any, b: any) => a.bookings - b.bookings,
                },
                {
                  title: "Tickets Sold",
                  dataIndex: "tickets",
                  key: "tickets",
                  sorter: (a: any, b: any) => a.tickets - b.tickets,
                },
                {
                  title: "Avg per Booking",
                  key: "avgPerBooking",
                  render: (_: any, record: any) => (
                    <span>${(record.revenue / record.bookings).toFixed(2)}</span>
                  ),
                },
              ]}
              rowKey="eventName"
              pagination={false}
            />
          </div>

          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>
              Revenue Comparison
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.revenueByEvent} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="eventName" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Comprehensive insights into your event bookings and revenue
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
}

export default ReportsPage;