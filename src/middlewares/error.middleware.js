import { ApiError, ApiResponse } from "../utils/api.utils.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const response = new ApiResponse(err.statusCode, err.data, err.message);
    return res.status(err.statusCode).json(response);
  }

  const response = new ApiResponse(err.statusCode || 500, null, err.message || "Internal Server Error");
  return res.status(err.statusCode || 500).json(response);
};

export default errorMiddleware;
