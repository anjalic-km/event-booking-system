import { useEffect, useState } from "react";
import PageTitle from "../../../../components/PageTitle";
import { message, Table, Tag, Input } from "antd";
import { getAllUsers } from "../../../../apiservices/userService";
import { getDateTimeFormat } from "../../../../helpers/dateTimeFormat";
import { Mail, Calendar, User as UserIcon, Search } from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

function CustomerPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      // Filter out admins - only show customers
      const customers = response.data.filter((user: UserType) => !user.isAdmin);
      setUsers(customers);
    } catch (error) {
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: UserType) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon size={20} className="text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{record.name}</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Mail size={12} />
              <span>{record.email}</span>
            </div>
          </div>
        </div>
      ),
      sorter: (a: UserType, b: UserType) => a.name.localeCompare(b.name),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-gray-400" />
          <span>{getDateTimeFormat(date)}</span>
        </div>
      ),
      sorter: (a: UserType, b: UserType) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Account Status",
      key: "status",
      render: () => (
        <Tag color="green" className="uppercase">
          Active
        </Tag>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: users.length,
    recentCustomers: users.filter(
      (u) =>
        new Date(u.createdAt).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000 // Last 30 days
    ).length,
    thisMonth: users.filter((u) => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div>
      <PageTitle title="Customers" />
      <p className="text-gray-600 text-sm mt-1 mb-5">
        View all registered customers and their information
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-blue-50 border border-blue-200 p-5 rounded">
          <p className="text-sm text-gray-600">Total Customers</p>
          <h2 className="text-3xl font-bold text-blue-700">{stats.total}</h2>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded">
          <p className="text-sm text-gray-600">New (Last 30 Days)</p>
          <h2 className="text-3xl font-bold text-green-700">
            {stats.recentCustomers}
          </h2>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-5 rounded">
          <p className="text-sm text-gray-600">This Month</p>
          <h2 className="text-3xl font-bold text-purple-700">
            {stats.thisMonth}
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-5">
        <Input
          placeholder="Search by name or email..."
          prefix={<Search size={16} className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
          allowClear
        />
      </div>

      {/* Customers Table */}
      {filteredUsers.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded mt-5">
          <p className="text-gray-500">
            {searchText ? "No customers found matching your search" : "No customers registered yet"}
          </p>
        </div>
      ) : (
        <Table
          dataSource={filteredUsers}
          columns={columns}
          loading={loading}
          rowKey="_id"
          className="mt-5"
          pagination={{
            pageSize: 15,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} customers`,
          }}
        />
      )}
    </div>
  );
}

export default CustomerPage;