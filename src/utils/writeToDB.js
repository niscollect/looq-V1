import { MongoClient } from "mongodb";

// connect to your Atlas deployment
const uri =  "mongodb+srv://nishant205shukla:mongoDaddy@cluster0.3vmi4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// ! process.env.MONGO_URI

const client = new MongoClient(uri);

export const writeInDB = async (taggedDocs) => {
   try 
   {
        const database = client.db("productDB");
        const tempColl = database.collection("sorted");

        await tempColl.deleteMany({}); // clear previous temp data
        const result = await tempColl.insertMany(taggedDocs);
        
        return result;
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
