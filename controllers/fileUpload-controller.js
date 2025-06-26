import ImageModel from "../models/uploadImage-model.js";
import uploadImageCloudinary from "../utils/uplaodImageCloudinary.js";

export async function uploadImage(req, res) {
  try {
    const userId = req.user._id;
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
      height: uploaded.height,
      size: uploaded.bytes,
      uploadedBy: userId,
      width: uploaded.width,
      likes: [],
      saved: [],
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

export const getMyImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const images = await ImageModel.find({ uploadedBy: userId });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Failed to fetch user's images:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await ImageModel.findById(id)
      .populate("category")
      .populate("uploadedBy");

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const images = await ImageModel.find({
      category: { $in: [categoryId] },
    }).populate("category");

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching images by category", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleLikeImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageId = req.params.id;

    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const isLiked = image.likes.includes(userId);

    if (isLiked) {
      image.likes.pull(userId);
    } else {
      image.likes.push(userId);
    }

    await image.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      totalLikes: image.likes.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleSaveImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageId = req.params.id;

    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const isSaved = image.saved.includes(userId);

    if (isSaved) {
      image.saved.pull(userId);
    } else {
      image.saved.push(userId);
    }

    await image.save();

    res.status(200).json({
      success: true,
      saved: !isSaved,
      totalSaves: image.saved.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMySaved = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await ImageModel.findById(id).populate("category");

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const search = async (req, res) => {
  try {
   const { query } = req.body;
   console.log(query)
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await ImageModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { "categoryDetails.name": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          imageUrl: 1,
          height: 1,
          width: 1,
          size: 1,
          uploadedBy: 1,
          likes: 1,
          saved: 1,
          categories: "$categoryDetails.name",
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching images found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
