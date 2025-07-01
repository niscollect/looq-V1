import multer from "multer";
// const upload = multer({ dest: 'uploads/' });


import { aggregatedResultArray } from "./utils/aggregationDB.js";

import { writeInDB } from "./utils/writeToDB.js";

import processImage from "./utils/vision.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const predictImageFromImageAndText = require('./utils/embeddingAPI.cjs');

import { uploadOnCloudinaryURL } from "./middlewares/cloudinary.js";


import express from "express";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";

import fs from "fs";
import { filteredDocs } from "./utils/filterDB.js";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public/pages")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });


let uploadedFilePath;

let URLArray = [];

let arrayOfTags = [];

app.post("/upload", upload.single("imageUploaded"), async (req, res) => {
    console.log("File uploaded:", req.file);
    uploadedFilePath = req.file.path;

  

    // TODO: After the image is uploaded, submit the image to Vision.
    const imageProcessingResult = await processImage(uploadedFilePath);

    console.log(imageProcessingResult);

    

    // todo:  we  have  the  image  tags
    let tagsArray = [];
    // let i = 1;
    imageProcessingResult.forEach((obj) => {
        // console.log(i, "-", obj.name);
        tagsArray.push(obj.name);
        // i++;
    })

    arrayOfTags = tagsArray;

    // todo:  we  have  the  image  URL
    const imageURL = await uploadOnCloudinaryURL(uploadedFilePath);
    console.log("\t\t\t Image URL: ", imageURL);

    // todo:  we  have  the  image  embedding
    const embedding = await predictImageFromImageAndText(uploadedFilePath);
    console.log("\t\t ==> ", embedding);


    



    let docMap = new Map(); // use _id as key for uniqueness
    
    console.log("starting filtering");
    
    for (const tag of tagsArray) {
      console.log("\t\t-----------", tag,"--------------\t\t");
    
      const docs = await filteredDocs(tag);
    
      docs.forEach(doc => {
        docMap.set(doc._id.toString(), doc); // _id as string key
      });
    }
    
    console.log("DONE WITH THIS");
    
    const docArray = Array.from(docMap.values()); // get unique documents
     
    // console.log(docArray);
    
    const resFromWriteToDB = await writeInDB(docArray);
    
    console.log("resFromWriteToDB: ", resFromWriteToDB);



    // ! Now we have filtering also done. Now we just need to comapre vectors and get the similar ones
    
;
;
    // * Use aggregation pipeline -> vector serach, for similarity comparison

    const aggregatedURLArray = await aggregatedResultArray(embedding);

    // console.log("}--------->", aggregatedURLArray);

    // console.log("Seems done");

    // ! we'll now have all the url's in one array, and can iterate over it and display the images in cards

    URLArray = aggregatedURLArray;

    fs.unlink(uploadedFilePath, (error)=>{ console.error("ERROR: ", error); });
    



    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        // path: `/temp/${req.file.filename}`
    });

});





app.get('/urlData', (req, res)=>{
    res.json(URLArray);
});






app.post("/dlt", async (req, res)=>{
    if(uploadedFilePath)
    {
        // await unlinkAsync(uploadedFilePath);
        fs.unlink(uploadedFilePath, (error)=>{ console.error("ERROR: ", error); });
        // res.json({ message: "Lever pulled successfully" });
    }
    else{
        console.log("You didn't uplaod the pic yet");
    }
})




const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("listening to PORT", PORT);
});
