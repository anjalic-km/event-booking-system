import api from "./axiosConfig";

export const uploadMediaFiles = async (formData: FormData) => {
  const response = await api.post("/events/upload-media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createEvent = async (data: any) => {
  const response = await api.post("/events/create-event", data);
  return response.data;
};

export const getEvents = async (queryString: string = "") => {
  const response = await api.get(`/events/get-events${queryString}`);
  return response.data;
};

export const getEvent = async (id: string) => {
  const response = await api.get(`/events/get-event/${id}`);
  return response.data;
};

export const editEvent = async (id: string, data: any) => {
  const response = await api.put(`/events/edit-event/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/delete-event/${id}`);
  return response.data;
};