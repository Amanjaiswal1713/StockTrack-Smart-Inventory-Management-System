import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(
    async (req, res) => {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    service: "StockTrack API",

                    environment:
                        process.env.NODE_ENV ||
                        "development",

                    timestamp:
                        new Date().toISOString(),
                },
                "StockTrack API is running"
            )
        );
    }
);

export { healthcheck };