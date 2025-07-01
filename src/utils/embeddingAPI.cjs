require("dotenv").config();

/**
 * TODO(developer): Uncomment these variables before running the sample.\
 * (Not necessary if passing values as arguments)
 */
const project = process.env.GC_PROJECTID; // ! PROCESS.ENV.GC_PROJECTID
const location = process.env.GC_LOCATION; // ! PROCESS.ENV.GC_LOCATION
// const baseImagePath = './public/uploads/img.png';
// const textPrompt = 'YOUR_TEXT_PROMPT';

const aiplatform = require("@google-cloud/aiplatform");

// Imports the Google Cloud Prediction service client
const { PredictionServiceClient } = aiplatform.v1;

// Import the helper module for converting arbitrary protobuf.Value objects.
const { helpers } = aiplatform;

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};
const publisher = "google";
const model = "multimodalembedding@001";

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

// const embedding = [];
// (async()=>{
//     const embedding = await predictImageFromImageAndText();
//     console.log("==+==>",embedding)

// })();

// predictImageFromImageAndText();

async function predictImageFromImageAndText(baseImagePath) {
  // Configure the parent resource
  const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

  const fs = require("fs");
  const imageFile = fs.readFileSync(baseImagePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString("base64");

  const prompt = {
    image: {
      bytesBase64Encoded: encodedImage,
    },
  };
  const instanceValue = helpers.toValue(prompt);
  const instances = [instanceValue];

  const parameter = {
    sampleCount: 1,
  };
  const parameters = helpers.toValue(parameter);

  const request = {
    endpoint,
    instances,
    parameters,
  };

  const embeddings = [];

  // Predict request
  const [response] = await predictionServiceClient.predict(request);
  console.log("Get image embedding response");
  console.log("");

  const predictions = response.predictions;
  console.log("\tPredictions :");

  console.log("\n");

  const numberValueObjectArray =
    predictions[0].structValue.fields.imageEmbedding.listValue.values;

  numberValueObjectArray.forEach((obj) => {
    const numberValue = obj.numberValue;
    embeddings.push(numberValue);
  });

  return embeddings;
}

module.exports = predictImageFromImageAndText;

// ! enclose in TRY-CATCH
