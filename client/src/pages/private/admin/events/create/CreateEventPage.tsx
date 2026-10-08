import PageTitle from "../../../../../components/PageTitle";
import EventForm from "../common/event-form/EventForm";

function CreateEventPage() {
  return (
    <div>
      <PageTitle title="Create Event" />
      <div className="mt-5">
        <EventForm />
      </div>
    </div>
  );
}

export default CreateEventPage;
