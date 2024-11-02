import { db } from "../db.js"

export const getUser = (req,res) => {
  // Get the user from the database
  const q = "SELECT * FROM Users WHERE userID = ?"

  db.query(q,[req.params.id], (err,data)=> {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  })
}