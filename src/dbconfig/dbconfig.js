import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;

    console.log("mongo db connected");

    connection.on("connected", () => {
      console.log("mongo db connected");
    });

    connection.on("error", (error) => {
      console.log("mongo db connection error", error);
      process.exit(1);
    });
  } catch (err) {
    console.log("some thing went wrong connection to db");
    console.log("db connection err", err);
  }
}
