const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const DBUser = "good-deal";
const DBPassword = "pxKPDJvkL9vuAwQ4";
const uri = `mongodb+srv://${DBUser}:${DBPassword}@cluster0.qmcox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("good-deal");
		const usersCollection = database.collection("users");
		const mailsCollection = database.collection("mails");

		// POST USERS
		app.get("/users/:email", async (req, res) => {
			const email = req.params.email;
			const query = { email: email };
			const user = await usersCollection.findOne(query);
			let isAdmin = false;
			if (user?.role === "admin") {
				isAdmin = true;
			}
			res.json({ admin: isAdmin });
		});

		app.get("/users", async (req, res) => {
			const cursor = usersCollection.find();
			const users = await cursor.toArray();
			res.json(users);
		});

		app.post("/users", async (req, res) => {
			const user = req.body;
			const result = await usersCollection.insertOne(user);
			res.json(result);
			console.log(result);
		});

		app.post("/mail", async (req, res) => {
			const withdraw = req.body;
			const result = await mailsCollection.insertOne(withdraw);
			res.json(result);
			console.log(result);
		});

		app.put("/deposit/:email", async (req, res) => {
			const email = req.params.email;
			const updatedDeposit = req.body;
			const filter = { email: email };
			const updateDoc = {
				$set: { balance: updatedDeposit.newBalance },
			};
			const options = { upsert: true };
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.json(result);
			// console.log(result);
		});

		app.put("/fpass/:email", async (req, res) => {
			const email = req.params.email;
			const updatedPass = req.body;
			const filter = { email: email };
			const updateDoc = {
				$set: { fundPass: updatedPass.fundPass },
			};
			const options = { upsert: true };
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.json(result);
			// console.log(result);
		});

		app.put("/card/:email", async (req, res) => {
			const email = req.params.email;
			const updatedCard = req.body;
			const filter = { email: email };
			const updateDoc = {
				$set: { bankCard: updatedCard.bankCard },
			};
			const options = { upsert: true };
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.json(result);
			// console.log(result);
		});

		app.put("/wallet/:email", async (req, res) => {
			const email = req.params.email;
			const updatedWallet = req.body;
			const filter = { email: email };
			const updateDoc = {
				$set: { walletAddress: updatedWallet.wallet },
			};
			const options = { upsert: true };
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.json(result);
			// console.log(result);
		});

		app.put("/users", async (req, res) => {
			const user = req.body;
			const filter = { email: user.email };
			const options = { upsert: true };
			const updateDoc = { $set: user };
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			// console.log(result);
			res.json(result);
		});

		app.put("/users/admin", async (req, res) => {
			const user = req.body;
			const requester = req.decodedEmail;
			if (requester) {
				const requesterAccount = await usersCollection.findOne({
					email: requester,
				});
				if (requesterAccount.role === "admin") {
					const filter = { email: user.email };
					const updateDoc = { $set: { role: "admin" } };
					const result = await usersCollection.updateOne(filter, updateDoc);
					res.json(result);
				}
			} else {
				res
					.status(403)
					.json({ message: "you do not have access to make admin" });
			}
		});
	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello Good Deal!");
});

app.listen(port, () => {
	console.log(`listening at ${port}`);
});
