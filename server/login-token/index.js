import express from 'express';
import multer from 'multer';
import moment from 'moment/moment';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import users from './users.js';
console.log(users);


const upload = multer();
const whiteList = ['http://localhost:5500', 'http://localhost:3000'];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允許連線'));
    }
  },
};

const secretkey = process.env.JWT_SECRET_KEY;

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ status: 'success',data:null,message:"首頁"});
});

app.listen(3005, () => {
  console.log('伺服器啟動中 http://localhost:3005');
});
