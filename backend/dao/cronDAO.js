let cronClient
export default class CronDAO {
    //creating connection with MongoDB
    static async injectDB(conn){
        if(cronClient){
            return
        }
        try {
            cronClient = await conn.db("CronJob").collection("cronJobCollection")
        }
        catch(e){
            console.error(`Unable to establish a connection handle in cronDAO: ${e}`)
        }
    }
    //updating CronJob database with today's date as _id and the number of subjects student has enrolled in
    static async updateCron(subjectCount){
        try {
            var today = new Date();
            var date = (today.getDate()).toString()
            var Month = (today.getMonth() + 1).toString()
            var Year = today.getFullYear().toString()
            var inputDate =  date + '/'+ Month + '/' + Year 
            const updateResponse = await cronClient.insertOne({_id:inputDate, month:Month,
                year:Year, subjects: subjectCount})
            console.log("updateResponse: ",updateResponse)
            return updateResponse
        }
        catch(error){
            console.error(`Unable to update CronJob: ${error}`)
            return { error: error }
        }
    }
    //Get the last N documents from the CronJobCollection 
    static async getCronData(N){
        try {
            var response
            var getDataResponse = await cronClient.find().sort({_id:-1}).limit(N).toArray()
            .then(res => {
              response=res
            }).catch(err => {
              console.log("Error: Update unsuccessfull.")
            });
            console.log(response)
            return response
        }
        catch(error){
            console.error(`Unable to get Cron Data: ${error}`)
            return { error: error }
        }
    }
}