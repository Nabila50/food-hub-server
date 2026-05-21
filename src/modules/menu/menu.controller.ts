import express from "express";

const router = express.Router();

router.post("/", (req, res)=>{
    res.send("Create a new post");
})

export const menuRouter: Router = router;