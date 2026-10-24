import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import {
  buildBusinessReport,
  getDeadStockProducts,
} from "../services/report.service.js";

const getReportSummary = asyncHandler(async (req, res) => {
  const report = await buildBusinessReport(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Report generated successfully"));
});

const getDeadStockReport = asyncHandler(async (req, res) => {
  const result = await getDeadStockProducts({
    ownerId: req.user._id,

    days: req.query.days,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Dead stock fetched successfully"));
});

export { getReportSummary, getDeadStockReport };
