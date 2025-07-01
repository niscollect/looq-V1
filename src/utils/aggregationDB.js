import { MongoClient } from "mongodb";

// connect to your Atlas deployment
const uri ="mongodb+srv://nishant205shukla:mongoDaddy@cluster0.3vmi4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// ! process.env.MONGO_URI

const client = new MongoClient(uri);

export const aggregatedResultArray = async (VectorEmbedding) => {
  try {
    const database = client.db("productDB");
    const myColl = database.collection("products");

    console.log("Starting aggregation");

    const result = await myColl
      .aggregate([
        // * stage-1
        {
          $vectorSearch: {
            queryVector: VectorEmbedding,
            path: "embedding",
            numCandidates: 100,
            limit: 6,
            index: "embedding_vector_index",
          },
        },
        // * stage-2
        {
          $project: {
            _id: 1,
            url: 1,
            similarity: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    // if empty results
    if (!result || result.length === 0) {
      console.log("No similar results found.");
      return [];
    }

    const urls = result.map((doc) => doc.url);

    return urls;

  } catch (err) {
    console.log("Mongo error while filtering: ", err);
  } finally {
    // await client.close();
  }
};
