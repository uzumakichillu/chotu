import schedulerDAO from "../dao/schedulerDAO.js"
import CronDAO from "../dao/cronDAO.js"

export default class SchedulerController {
    //Delete the user from Scheduler database
    static async apiDeleteEntry(req,res,next){
        const {email} = req.body
        try {
            const deleteEntryResponse = await schedulerDAO.deleteEntry(email)
            return res.status(200).json(deleteEntryResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Update the user's entry of subjects for scheduler
    static async apiUpdateEntry(req,res,next){
        const {email, addSubjects} = req.body
        try {
            const updateResponse = await schedulerDAO.updateEntry(email,addSubjects)
            return res.status(200).json(updateResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Get the count of how many students have enrolled for each subject
    //and total number of subjects 
    static async apiGetCount(req,res,next){
        try {
            const countResponse = await schedulerDAO.getCount()
            return res.status(200).json(countResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Get subjects of the student in which student has enrolled in
    static async apiStudentData(req,res,next){
        try {
            const {email} = req.body
            const studentDataResponse = await schedulerDAO.studentData(email)
            return res.status(200).json(studentDataResponse) 
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Get last 'number' (or last N days) of records of scheduler 
    static async apiCronData(req,res,next){
        try {
            const {number} = req.body
            const CronDataResponse = await CronDAO.getCronData(number)

            return res.status(200).json(CronDataResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    
}

