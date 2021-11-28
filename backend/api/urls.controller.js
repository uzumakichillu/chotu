import UrlsDAO from "../dao/urlDAO.js"
import validUrl from  "valid-url"
import {v4 as uuidv4} from "uuid"

export default class UrlsController {
    //Creating a URL for meeting
    static async apiCreateUrl(req,res,next){
        try {
            const url = 'http://localhost:3000/api/redirect/'+uuidv4();
            if(!validUrl.isUri(url)){
                return res.status(401).json('Invalid base URL')
            }

            const GetUrlResponse = await UrlsDAO.createUrl(url)
            res.json(GetUrlResponse)
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    //Get the URL for video using the meeting code
    static async apiGetUrl(req,res,next){
        try{
            console.log(req.params.code)
            const url = await UrlsDAO.getUrl(req.params.code)

            if(url){
                res.redirect(url)
            }
            else res.status(404).json('No URL found')
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
    
    static async apiRedirectUrl(req,res,next){
        try{
            
            res.status(200).json({ success: "redirect working" })
        }
        catch(err){
            res.status(500).json({ error: err.message })
        }
    }
}