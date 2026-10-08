import { useEffect, useState } from "react";
import PageTitle from "../../../../../components/PageTitle";
import EventForm from "../common/event-form/EventForm";
import { message } from "antd";
import { getEvent } from "../../../../../apiservices/eventService";
import { useParams } from "react-router-dom";
import Spinner from "../../../../../components/Spinner";

function EditEventPage() {
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEvent(params.id);
      setEventData(response.data);
    } catch (error) {
      message.error("Failed To Fetch Event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Edit Event" />
      <div className="mt-5">
        {/* Pass fetched data as initialData and tell the form it's in edit mode */}
        <EventForm initialData={eventData} type="edit" />
      </div>
    </div>
  );
}

export default EditEventPage;