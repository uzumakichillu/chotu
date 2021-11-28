import express from "express"
import PeopleController from "./people.controller.js"
import UrlsController from "./urls.controller.js"
import SchedulerController from "./scheduler.controller.js"

const router = express.Router()

//Routes for meeting
router.route("/url/shorten").post(UrlsController.apiCreateUrl)  //create short url
router.route("/:code").get(UrlsController.apiGetUrl)            //fetch URL using code
router.route("/redirect/:longUrl").get(UrlsController.apiRedirectUrl) //redirected from short URL

//Routes for students
router.route("/login").post(PeopleController.apiLogin)          //login by user
router.route("/register").post(PeopleController.apiRegister)    //register user
router.route("/getVideos").post(PeopleController.apiGetVideos)  //get videos based on user's subjects

//Routes for scheduler
router.route("/myScheduler/update").post(SchedulerController.apiUpdateEntry)     //update student entry in scheduler
router.route("/scheduler/delete").delete(SchedulerController.apiDeleteEntry)    //delete student entry in scheduler
router.route("/scheduler/count").post(SchedulerController.apiGetCount)          //get count of students in each subject
router.route("/scheduler/student").post(SchedulerController.apiStudentData)     //get subjects a student has enrolled for 

//Route for cron job
router.route('/scheduler/cronJobs').post(SchedulerController.apiCronData)       //get last N records of CronJob data
export default router