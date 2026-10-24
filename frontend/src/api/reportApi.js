import axiosInstance from "./axiosInstance";

const getReportSummary = async () => {
  const response = await axiosInstance.get("/reports/summary");

  return response.data;
};

const getDeadStock = async (days = 90) => {
  const response = await axiosInstance.get("/reports/dead-stock", {
    params: {
      days,
    },
  });

  return response.data;
};

export { getReportSummary, getDeadStock };
