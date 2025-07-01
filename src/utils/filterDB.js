import { MongoClient } from "mongodb";

// connect to your Atlas deployment
const uri =  "mongodb+srv://nishant205shukla:mongoDaddy@cluster0.3vmi4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// ! process.env.MONGO_URI

const client = new MongoClient(uri);

export const filteredDocs = async (tag) => {
   try 
   {
        const database = client.db("productDB");
        const collection = database.collection("products");

        const results = await collection.find(
            { tags: tag },                  // match documents
        ).toArray();

        if (results.length === 0) {
            console.log("No documents found for tag:", tag);
            return [];
        }

        // // Remove _id from each document
        // const docsWithoutId = results.map(doc => {
        //     const { _id, ...rest } = doc;
        //     return rest;
        // });
        // return docsWithoutId;

        return results;
   }
   catch(err)
   {
        console.log("Mongo error while filtering: ", err);
   }
   finally
   {
    // await client.close();
   }
}
