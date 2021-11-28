import PeopleDAO from "../dao/peopleDAO.js";


export default class PeopleController {
    //Register to app - provide name, email, password, subjects
    static async apiRegister(req,res,next){
        try {
            const { name, email, password, subjects } = req.body;
            if (!(email && password && name)) {
                res.status(400).send({"response":"All input is required"});
            }
            const registerResponse = await PeopleDAO.createUser(name, email, password, subjects)
            return res.status(201).json(registerResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Login to app
    static async apiLogin(req,res,next){
        try {
            const { email, password } = req.body;
            if (!(email && password)) {
                res.status(400).json({error :"All input is required"});
            }
            const loginResponse = await PeopleDAO.LoginUser(email,password)
            
            if(loginResponse){
                return res.status(200).json(loginResponse);
            }
            else res.status(400).json({error:"Invalid Credentials"});
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Fetch videos using keywords as subjects
    static async apiGetVideos(req,res,next){
        try{
            const {subjects}  = req.body;
            
            const VideoResponse = await PeopleDAO.VideoData(subjects)
            return res.status(200).json({ success : VideoResponse})

        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    
}
