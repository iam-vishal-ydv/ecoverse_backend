import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    imageUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FileUpload", imageSchema);
