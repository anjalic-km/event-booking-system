import api from "./axiosConfig";

export const createBooking = async (data: any) => {
  const response = await api.post("/bookings/create-booking", data);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get("/bookings/get-user-bookings");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/bookings/get-all-bookings");
  return response.data;
};

export const getBooking = async (id: string) => {
  const response = await api.get(`/bookings/get-booking/${id}`);
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.delete(`/bookings/cancel-booking/${id}`);
  return response.data;
};