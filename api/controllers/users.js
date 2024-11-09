import { db } from "../db.js"

export const getUser = (req,res) => {
  // Get the user from the database
  const q = "SELECT * FROM Users WHERE userID = ?"

  db.query(q,[req.params.id], (err,data)=> {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  })
}

export const getUsers = (req,res) => {
  // Get a list of Users from the database
}