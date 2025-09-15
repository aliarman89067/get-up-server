import { Db, MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

let db: Db;

const connect = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI!);
    db = client.db();
  } catch (error) {
    console.log(error);
  }
};

connect();

const getUsers = () => {
  const usersCollection = db.collection("user");
  return usersCollection;
};
const getUser = (id: string) => {
  const usersCollection = db
    .collection("user")
    .findOne({ _id: new ObjectId(id) });
  return usersCollection;
};

export { db, getUsers, getUser };
