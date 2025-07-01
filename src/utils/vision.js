// Load environment variables from .env
import "dotenv/config";

// import { configDotenv } from "dotenv";

console.log("Loaded path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Import Google Cloud Vision client
import { v1 } from "@google-cloud/vision";

// Import Node.js file system module
import fs from "fs";

// Create a Vision API client
const client = new v1.ImageAnnotatorClient();

// Image file path
// We'll try take it from the user, i.e. from the server disk storage    ----    " fileName "
// const fileName = `./public/uploads/img.png`;

// Main async function to run the API call
async function processImage(filePath) {
  console.log(filePath);

  // Read the image file and prepare request
  const request = {
    image: { content: fs.readFileSync(filePath) },
  };

  const [result] = await client.objectLocalization(request); // access the first element of the array returned

  console.log(result);

  const objects = result.localizedObjectAnnotations;

  if (objects.length == 0) {
    console.log("There's a problem with the image");
  }

  const tagMap = new Map();

  objects.forEach((object) => {
    const NAME = object.name;
    const SCORE = object.score;

    if (!tagMap.has(NAME)) {
      // First time seeing this object name
      tagMap.set(NAME, { count: 1, confidence: [SCORE] });
    } else {
      // means it already exists    -->   so, just update it
      const tag = tagMap.get(NAME);
      tag.count += 1;
      tag.confidence.push(SCORE);
    }
  });

  //? Now we have the raw list of objects - structured map with aggregated count and confidence
  //! so the tagMap looks like:   Map {
  //!         "Person" => { count: 2, confidence: [0.91, 0.90] },
  //!         "Shoe" => { count: 1, confidence: [0.88] }
  //!     }

  // we can convert this map into an array of objects, as maps aren't JSON friendly, and so can't be shared in an API, also printing isn't that direct

  const tags = [...tagMap.entries()].map(([name, data]) => ({
    name,
    count: data.count,
    avg_confidence:
      data.confidence.reduce((sum, val) => sum + val, 0) /
      data.confidence.length.toFixed(2),
  }));
  //! tagMap.entries() gives you [name, {count, confidence}] for each object

  return tags;
}

//
//
//

//todo: export processImage()

// const processResult = await processImage(`./public/uploads/img.png`).catch((err) => {
//   console.error("❌ Error occurred:", err.message);
//   process.exit(1);
// });

// console.log(processResult);

export default processImage;

// this can not be sent as an API response easily

// TODO: send this as API response and show the tags which are idnetified, now the user has to choose what was he searching for. The tag that he chooses,

// ! Enclose in TRY-CATCH

// ! EDGE CASE:     (1) Unrecognized image    (2) Image upload problem
