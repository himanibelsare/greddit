import express from 'express';
import User from "../models/User.js"

const router = express.Router();

//login
router.post('/', async (req, res) => {
    try{
        const {username, password} = req.body;
        // 1. check if password matches
        // 2. generate a token
        const user = await User.findOne({username});
        if(!user) return res.status(400).send({errors: [{msg: 'No user found'}]})
        const match = await user.checkPassword(password);
        if(match)
        {
            const token = user.generateToken();
            return res.send({token});
        }
        return res.status(401).send({errors: [{msg: "Invalid password"}]});
    }
    catch(err){
        res.status(500).send({errors: [{msg: 'Server Error'}]});
    }

});

export default router;