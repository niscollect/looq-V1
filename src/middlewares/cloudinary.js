import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//  , // ! process.env.CLOUDINARY_CLOUD_NAME
  api_key: process.env.CLOUDINARY_API_KEY,
// , // ! process.env.CLOUDINARY_API_KEY
  api_secret: process.env.CLOUDINARY_API_SECRET,
// , // ! process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinaryURL = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // TODO:  in  v2  we  can  be  save  only  the  cropped  part  and  that  would  be  efficient  and  we'll  not  have  to  use  any  other  library  to  crop  images

    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: "product-Image",
    });
    // console.log("File uploaded successfully with the response: ", response.url);

    return response.url;
  } catch (err) {
    console.error("ERROR: ", err);
  }
};

// test:   uploadOnCloudinaryURL('./public/uploads/img.png');
