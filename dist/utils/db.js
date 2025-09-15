"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = exports.db = void 0;
const mongodb_1 = require("mongodb");
require("dotenv/config");
let db;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(process.env.MONGO_URI);
        exports.db = db = client.db();
    }
    catch (error) {
        console.log(error);
    }
});
connect();
const getUsers = () => {
    const usersCollection = db.collection("user");
    return usersCollection;
};
exports.getUsers = getUsers;
const getUser = (id) => {
    const usersCollection = db
        .collection("user")
        .findOne({ _id: new mongodb_1.ObjectId(id) });
    return usersCollection;
};
exports.getUser = getUser;
