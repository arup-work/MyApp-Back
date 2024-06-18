import JWT from "jsonwebtoken";
import * as express from 'express';

const authRoute =  express.Router();

const users = [{
    id: 1,
    email: 'arup@pitangent.com',
    password: '1234567'
}];



authRoute.post('/login',(req, res, next) => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (!user) {
        res.status(401).json({
            msg: "Unauthorized access!"
        })
    }

    if (user.password !==  password) {
        res.status(401).json({
            msg: "Invalid credential!"
        })
    }

    const token = JWT.sign({
        email
    },process.env.ACCESS_TOKEN_SECRET_KEY);

    res.status(200).json({
        msg: "Login successfully!",
        token
    })
});

export default authRoute;
