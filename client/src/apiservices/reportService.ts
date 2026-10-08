import api from "./axiosConfig";

export const getRevenueAnalytics = async (params: {
  startDate?: string;
  endDate?: string;
  eventId?: string;
}) => {
  const response = await api.get("/reports/revenue-analytics", { params });
  return response.data;
};

export const exportExcel = async (params: {
  startDate?: string;
  endDate?: string;
  eventId?: string;
}) => {
  const response = await api.get("/reports/export-excel", {
    params,
    responseType: "blob",
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `bookings-report-${Date.now()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportPDF = async (params: {
  startDate?: string;
  endDate?: string;
  eventId?: string;
}) => {
  const response = await api.get("/reports/export-pdf", {
    params,
    responseType: "blob",
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `bookings-report-${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportCSV = (data: any[], filename: string) => {
  // Convert data to CSV
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    ),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};