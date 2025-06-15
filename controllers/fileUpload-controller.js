import ImageModel from "../models/uploadImage-model.js";

export async function uploadImage(req, res) {
  try {
    const userId = req.userId;
    const { title, description, category } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploaded = await uploadImageCloudinary(file);
    if (!uploaded?.url) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed" });
    }

    const image = await ImageModel.create({
      title,
      description,
      category,
      imageUrl: uploaded.url,
      uploadedBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

export async function getAllUploadImage(req, res) {
  try {
    const images = await ImageModel.find()
      .populate("uploadedBy", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All images fetched successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
}
