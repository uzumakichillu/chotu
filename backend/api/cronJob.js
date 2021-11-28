import * as nodemailer from 'nodemailer'
import UrlsDAO from "../dao/urlDAO.js"
import schedulerDAO from '../dao/schedulerDAO.js'
import {v4 as uuidv4} from "uuid"
import CronDAO from '../dao/cronDAO.js'


async function apiScheduleMeet(){
    try {
        //get count of all the enrolled students subject wise
        const countData = await schedulerDAO.getCount()
        //extract subjects from query response
        var subjectData = countData.subjects

        console.log(subjectData)
        //sort by count
        subjectData = sort_by_key(subjectData,"count")
        //pick each subject

        let map = new Map();    //map to store count of people alloted for each subject
        var left=0              //left out people
        var countAll=0

        for(var i=0 ; i<subjectData.length ; i++){
            
            //get all students for a subjects, students deleted earlier wont appear

            var count=0 //we will count number of students alloted
            try{
                const studentData = await schedulerDAO.findBySubject(subjectData[i]._id)

                var j=studentData.length-1
                if(j==0) left++

                if(studentData.length%2==0){
                    while(j>=1){
                        var email1 = studentData[j].email
                        var email2 = studentData[j-1].email
                        j-=2
                        count+=2
                        scheduleMeet([email1,email2], subjectData[i]._id)
                        await schedulerDAO.deleteEntry(email1)
                        await schedulerDAO.deleteEntry(email2)     
                    }
                }
                else {
                    
                    while(j>2){
                        var email1 = studentData[j].email
                        var email2 = studentData[j-1].email
                        count+=2
                        j-=2
                        scheduleMeet([email1,email2], subjectData[i]._id)
                        await schedulerDAO.deleteEntry(email1)
                        await schedulerDAO.deleteEntry(email2)
                    }
                    if(j==2){
                        var email1 = studentData[j].email
                        var email2 = studentData[j-1].email
                        var email3 = studentData[j-2].email
                        count+=3
                        j=-1
                        scheduleMeet([email1,email2,email3], subjectData[i]._id)
                        await schedulerDAO.deleteEntry(email1)
                        await schedulerDAO.deleteEntry(email2)
                        await schedulerDAO.deleteEntry(email3)
                    }
                    
                }   
            }
            catch(err){
               console.log(err)
            }
            map.set(subjectData[i]._id,count)
            countAll+=count
        }
        map.set("total",countAll)
        map.set("left",left)

        //now prepare data to be sent to cronDAO
        var subjectCount=[]
        map.forEach( (value, key, map) => {
            subjectCount.push({subject:key, count:value}); 
        });
        
        //update the database for CronJob
        const updateCronResponse = await CronDAO.updateCron(subjectCount)
        
        
    }
    catch(err){
        console.log(err)
    }
}

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: '',
      pass: '',
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      accessToken: ''
    }
});


async function scheduleMeet(mailingList, subject){
    const url = 'http://localhost:3000/api/redirect/'+uuidv4();
    const GetUrlResponse = await UrlsDAO.createUrl(url)

    let mailOptions = {
            from: '',
            subject: 'Link for P2P meet',
            text: `Hi,\nWe have scheduled a meet for ${subject}.\n 
            Join this link: ${GetUrlResponse} to discuss with your peer.\n`,
            bcc: mailingList
        };
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
        console.log("Error " + err);
        } else {
            console.log(data)
        console.log("Email sent successfully");
        }
    });
}


export default apiScheduleMeet