import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import { register } from "./contoller/auth/register";
import { login } from "./contoller/auth/login";
import { verifyToken } from "./utils/jwt";
// import { insertIntoPool } from "./contoller/pool/insert";
// import { deleteFromPool } from "./contoller/pool/delete";
// import { findOpponent } from "./contoller/pool/search";
// import { listPoolUsers } from "./contoller/pool/listPoolUsers";
import { addGameHistory } from "./contoller/gamehistory/addGameHistory";
import { listNGameHistory } from "./contoller/gamehistory/listNGameHistory";
import { listTopPlayers } from "./contoller/gamehistory/listTopPlayer";
import { updateUserProfile } from "./contoller/profile/updateUserProfile";
import { getUserProfile } from "./contoller/profile/getUserProfile";
const app = express();



app.use(express.json({ limit: '10mb' })); // Set limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up and running" });
});


app.post("/login", login)
app.post("/register", register)


app.use(verifyToken);
// app.post("/insertIntoPool", insertIntoPool)
// app.post("/deleteFromPool", deleteFromPool)
// app.get("/listPoolUsers", listPoolUsers)
// app.post("/findOpponent", findOpponent)


app.post("/addGameHistory", addGameHistory)
app.get("/listGameHistory/:n", listNGameHistory);
app.get("/listTopPlayers", listTopPlayers);
app.post("/updateUserProfile", updateUserProfile);
app.get("/getUserProfile", getUserProfile);


export default app;
