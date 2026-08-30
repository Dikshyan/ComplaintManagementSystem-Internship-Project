const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectCloudinary = async () => {
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary Connected");
  } catch (error) {
    console.error("Cloudinary Connection Failed:", error.message);
  }
};

module.exports = {
  cloudinary,
  connectCloudinary,
};