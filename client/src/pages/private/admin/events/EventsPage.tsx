import { Button, message, Popconfirm, Table } from "antd";
import PageTitle from "../../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../../../../apiservices/eventService";
import { getDateTimeFormat } from "../../../../helpers/dateTimeFormat";
import { Pen, Trash2 } from "lucide-react";

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      message.error("Failed to Fetch Events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      message.success("Event deleted successfully");
      // Refresh the list in place — no full reload needed
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      message.error("Failed to delete event");
    }
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date: any, row: any) =>
        getDateTimeFormat(`${date} ${row.time}`),
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: any) => getDateTimeFormat(date),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-5">
          <Pen
            className="cursor-pointer text-yellow-700"
            size={16}
            onClick={() => navigate(`/admin/events/edit/${record._id}`)}
          />
          <Popconfirm
            title="Delete Event"
            description="Are you sure you want to delete this event?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Trash2 className="cursor-pointer text-red-700" size={16} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Events" />
        <Button type="primary" onClick={() => navigate("/admin/events/create")}>
          Create Event
        </Button>
      </div>
      <Table
        dataSource={events}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}

export default EventsPage;