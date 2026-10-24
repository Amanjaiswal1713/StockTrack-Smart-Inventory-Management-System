import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema(
  {
    name: {
      type: String,

      required: [true, "Supplier contact name is required"],

      trim: true,

      maxlength: [100, "Supplier contact name cannot exceed 100 characters"],
    },

    company: {
      type: String,

      required: [true, "Company name is required"],

      trim: true,

      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    email: {
      type: String,

      trim: true,
      lowercase: true,
      default: "",

      match: [/^$|^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",

      maxlength: [30, "Phone number cannot exceed 30 characters"],
    },

    address: {
      type: String,
      trim: true,
      default: "",

      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    status: {
      type: String,

      enum: {
        values: ["Active", "Inactive"],

        message: "Status must be Active or Inactive",
      },

      default: "Active",
    },

    owner: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },
  },

  {
    timestamps: true,
  },
);

supplierSchema.index(
  {
    owner: 1,
    company: 1,
  },

  {
    unique: true,

    name: "unique_supplier_company_per_owner",
  },
);

supplierSchema.index({
  owner: 1,
  status: 1,
});

supplierSchema.index({
  owner: 1,
  createdAt: -1,
});

export const Supplier = mongoose.model("Supplier", supplierSchema);
