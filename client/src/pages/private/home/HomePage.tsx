import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { message } from "antd";
import { getEvents } from "../../../apiservices/eventService";
import EventCard from "./common/EventCard";
import type { eventType } from "../../../interfaces";
import Filters from "./common/Filters";

function HomePage() {
  const [events, setEvents] = useState<eventType[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();

  const getData = async (filterParams?: { searchText?: string; date?: string }) => {
    try {
      setLoading(true);
      // Build query string from filters
      const queryParams = new URLSearchParams();
      const searchText = filterParams?.searchText || "";
      const date = filterParams?.date || "";
      
      if (searchText) queryParams.append("search", searchText);
      if (date) queryParams.append("date", date);
      
      const queryString = queryParams.toString();
      const url = queryString ? `?${queryString}` : "";
      
      const response = await getEvents(url);
      setEvents(response.data);
    } catch (error) {
      message.error("Failed to Fetch Data");
    } finally {
      setLoading(false);
    }
  };

  const onFilter = (appliedFilters: { searchText: string; date: string }) => {
    getData(appliedFilters);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl">Welcome, {currentUser?.name}</p>
      <Filters filters={filters} setFilters={setFilters} onFilter={onFilter} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-7 mt-5">
          {events.length === 0 ? (
            <p className="text-gray-500">No events found</p>
          ) : (
            events.map((event: eventType) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;