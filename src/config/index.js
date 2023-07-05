import dotenv from "dotenv";
import express from 'express'
import cors from "cors";
import router from "router";
const path = require("path");
import sequelize from "./sequelize";
import { createServer } from "http";
import socket from "socket";
dotenv.config();
const PORT = process.env.PORT || 8080;
export default function run(app) {
    const httpServer = createServer(app);
    app.use(cors({ credentials: true, origin: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/public', express.static( path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    router(app)
    socket(httpServer)
    httpServer.listen(PORT,()=>{
        console.log('dang chay')
    });

}
