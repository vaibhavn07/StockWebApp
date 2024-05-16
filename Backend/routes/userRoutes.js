const router = require('express').Router();
const User = require('../schema/User')
const Stock = require('../schema/Stock')
const mongoose = require('mongoose');
// const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const loginMiddleware = require('../middleware/loginMiddleware');
require('../db/db');


const JWT_KEY = 'vaibhavn2007@gmail.com';


router.get('/login', async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json("Invalid Credentials");
    }
    const pass = await bcrypt.compare(password,user.password); 
    if (pass) {
        console.log('user found');
        const obj = {
            user: {
                email: email,
                name: name,
                password: password
            }
        };
        const data = jwt.sign(obj, JWT_KEY);
        res.setHeader('auth-token',data);
        return res.status(200).json(data);
    }

    return res.status(404).json('Invalid Credentials');
});


router.post('/signup', async (req, res) => {
    const {
        name, email, password
    } = req.body;
    const user1 = await User.findOne({ email });
    if (user1) {
        return res.status(200).json("Already user exist with the mail");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    const user = new User({
        name, email, password:hashPassword
    });
    const stock = new Stock({
        Userid:user._id
    });
    user.save();
    return res.status(201).json({"Success":"Signed Up",user});
});


router.get('/deletestock:id',loginMiddleware, async (req, res) => {
    const email = req.user.email;
    const id = req.params.id;
    const user = await User.findOne({ email: email });
    // user.stocks = user.stocks.filter(element => element !== id);
    console.log(user.stocks)
    user.stocks = user.stocks.filter((element)=>element!=id.slice(1,id.length));
    user.save();
    console.log(user.stocks)
    return res.status(200).json("deleted");
});

router.post('/addstock:id',loginMiddleware,async (req, res) => {
    const email = req.user.email;
    const id = req.params.id;
    const user = await User.findOne({ email: email });
    // const stock = await Stock.findOne({ Userid: user._id });
    // console.log(stock.name,typeof(stock.name))
    if(user.stocks.indexOf(id.slice(1,id.length))==-1){
        user.stocks.push(id.slice(1,id.length));
        user.save();
        console.log(user.stocks)
        return res.status(201).json("added");
    }
    return res.status(208).json("Already Available");
})


module.exports = router;