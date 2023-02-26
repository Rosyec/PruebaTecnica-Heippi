"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(`mongodb+srv://root:admin@cluster0.mfzggdc.mongodb.net/backend`)
    .then(() => {
    console.log("Connection DB Mongo - OK");
})
    .catch((error) => console.log("Connection DB Mongo - Error: ", error));
