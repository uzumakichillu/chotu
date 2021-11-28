import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import axios from "axios"
let peopleClient

const API_key = ''

export default class PeopleDAO {
    //creating connection with MongoDB
    static async injectDB(conn){
        if(peopleClient){
            return
        }
        try {
            peopleClient = await conn.db("institute").collection("class")
            await peopleClient.createIndex({"email": 1}, { unique:true})
        }
        catch(e){
            console.error(`Unable to establish a connection handle in PeopleDAO: ${e}`)
        }
    }
    //creating user with name, email, password, subjects
    static async createUser(Name, Email, Password, Subjects){
        try{
            const oldUser = await peopleClient.findOne({ email: Email });
            if (oldUser) {
                const createResponse = "User Already Exist. Please Login"
                return createResponse;
            }
            else {
                //storing encrypted password for authentication
                const encryptPassword = await bcrypt.hash(Password,10)  

                const userDoc = {
                    name:Name,
                    email:Email.toLowerCase(),
                    password:encryptPassword,
                    subjects:Subjects
                }

                const createResponse = await peopleClient.insertOne(userDoc)

                const token = jwt.sign(
                    { user_id: createResponse._id, Email },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    })
                
                createResponse.token = token
                return createResponse
            }
        }
        catch(error){
            console.error(`Unable to add user: ${error}`)
            return { error: error }
        }
       
    }
    //Logging in User with email and password
    static async LoginUser(Email, Password){
        try{
            const user = await peopleClient.findOne({ email: Email});
            if (user && (await bcrypt.compare(Password, user.password))) {
                // Create token
                const token = jwt.sign(
                  { user_id: user._id, Email },
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
          
                user.token = token;
          
                return user;
            }
            else return null;
        }
        catch(error){
            console.error(`Unable to login user: ${error}`)
            return { error: error }
        }
    }
    //Fetch data from YouTube API using keywords as subjects the student has registered for
    static async VideoData(subjects){
        try{
            let subjectQuery=""
            for(var i= 0 ; i<subjects.length ; i++){
                subjectQuery = subjectQuery + subjects[i]+'%7C'
            }
           
            subjectQuery = subjectQuery.substring(0,subjectQuery.length-3)

            const instance =  axios.create({
                baseURL : `https://youtube.googleapis.com/youtube/v3/search?&key=${API_key}\
                &part=snippet&eventType=completed&maxResults=50&order=relevance&q=${subjectQuery}&safeSearch=strict&type=video\
                &videoCaption=closedCaption&videoDefinition=standard&videoDimension=2d&videoDuration=any&videoEmbeddable=true\
                &videoLicense=any&videoType=any`,
                
                headers : {
                    "Content-type" : "application/json"
                },
                
            })  
            let responseList = []
            await instance.get()
            .then(videoResponse => {
            
                for(var i=0 ; i<videoResponse.data.items.length ; i++){
                    let res = {videoId:videoResponse.data.items[i].id.videoId,
                        time: videoResponse.data.items[i].snippet.publishedAt,
                        thumbnail: videoResponse.data.items[i].snippet.thumbnails.medium,
                        title: videoResponse.data.items[i].snippet.title,
                        description: videoResponse.data.items[i].snippet.description,
                        channelName: videoResponse.data.items[i].snippet.channelTitle,
                        key: i
                        }
                    
                    responseList = [...responseList, res]
                }
            })
            .catch(error =>{
                console.log("Error from axios: ", error)
            })
            
            return responseList
        }
        catch(error){
            console.error(`Unable to fetch video data: ${error}`)
            return { error: error }
        }
    }

}