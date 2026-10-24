import mongoose from "mongoose";

const errorHandler = (
    error,
    req,
    res,
    next
) => {
    let statusCode =
        error.statusCode || 500;

    let message =
        error.message ||
        "Internal server error";

    let errors =
        error.errors || [];

    if (
        error instanceof
        mongoose.Error.ValidationError
    ) {
        statusCode = 400;
        message = "Validation failed";

        errors = Object.values(
            error.errors
        ).map((validationError) => ({
            field:
                validationError.path,

            message:
                validationError.message,
        }));
    }

    if (
        error instanceof
        mongoose.Error.CastError
    ) {
        statusCode = 400;

        message =
            `Invalid value provided for ${error.path}`;
    }

    if (error?.code === 11000) {
        statusCode = 409;

        const duplicateField =
            Object.keys(
                error.keyValue || {}
            )[0];

        message = duplicateField
            ? `${duplicateField} already exists`
            : "A record with this value already exists";
    }

    const response = {
        statusCode,
        success: false,
        message,
        data: null,
        errors,
    };

    if (
        process.env.NODE_ENV ===
        "development"
    ) {
        response.stack = error.stack;
    }

    return res
        .status(statusCode)
        .json(response);
};

export { errorHandler };