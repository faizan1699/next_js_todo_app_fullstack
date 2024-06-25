
import mongoose from "mongoose";

export async function connect() {

    try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const connection = mongoose.connect;

        connection.on("connected", () => {
            console.log("mongo db connected");
        })

        connection.on("error", (err) => {
            console.log("mongo db connection error");
            console.log(err);
            process.exit(1);
        })

    }

    catch (err) {
        console.log("some thing went wrong connection to db");
        console.log("db connection err", err);
    }

}

