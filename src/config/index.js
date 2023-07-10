import dotenv from "dotenv";
import express from 'express'
import cors from "cors";
import router from "router";
const path = require("path");
import sequelize from "./sequelize";
import { createServer } from "http";
import auth from '../middleware/authenJWT'
import socket from "socket";
import bodyParser from "body-parser";
import multer from "multer";
dotenv.config();
const PORT = process.env.PORT || 8080;
export default function run(app) {
    const upload = multer({
        storage: multer.memoryStorage()
    })
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(upload.any('file'))
    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    const httpServer = createServer(app);
    router(app)
    socket(httpServer)
    httpServer.listen(PORT, () => {
        console.log('dang chay')
    });

}
