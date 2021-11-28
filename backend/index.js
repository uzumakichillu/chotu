import mongodb from "mongodb"
import dotenv from "dotenv"
import UrlsDAO from "./dao/urlDAO.js"
import PeopleDAO from "./dao/peopleDAO.js"
import schedulerDAO from './dao/schedulerDAO.js'
import CronDAO from "./dao/cronDAO.js"
import httpServer from './server.js'
import {CronJob} from 'cron'
import apiScheduleMeet from './api/cronJob.js'

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(process.env.DB_URI,
    {
        maxPoolSize:50,
        useNewUrlParser:true
        
    })
    .catch(err=>{
        console.log(err.stack)
        process.exit(1)
    })
    .then(async client =>{
        await UrlsDAO.injectDB(client)
        await PeopleDAO.injectDB(client)
        await schedulerDAO.injectDB(client)
        await CronDAO.injectDB(client)
        
        //ensuring connected to database first and then start job

        httpServer.listen(port, ()=>{
            console.log(`listening on port: ${port}`)
        })
    })

//Cron Job scheduled at 07.40 pm every day 
const job = new CronJob('00 40 19 * * *',
    function() {
        apiScheduleMeet()
    },
    function(){
        console.log('cronjobs updated')
    },
    true,
    'Asia/Kolkata'
);


export default job
