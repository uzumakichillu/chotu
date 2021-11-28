
let scheduleClient
export default class schedulerDAO {
    static async injectDB(conn){
        if(scheduleClient){
            return
        }
        try {
            scheduleClient = await conn.db("scheduler").collection("students")
            await scheduleClient.createIndex({"email": 1}, { unique:true})
        }
        catch(e){
            console.error(`Unable to establish a connection handle in schedulerDAO: ${e}`)
        }
    }
    static async deleteEntry(Email){
        try {
            const deleteResponse = await scheduleClient.deleteOne({ email: Email });
            return deleteResponse
        }
        catch(error){
            console.error(`Unable to delete user: ${error}`)
            return { error: error }
        }
    }
    static async getCount(){
        try {
            var response;
            const countResponse = await scheduleClient.aggregate(
                [
                    { 
                        $facet: {
                            "subjects": [
                                {
                                    $unwind:"$subjects"
                                },
                                { 
                                    $group: { _id: "$subjects", count: { "$sum": 1 } } 
                                }
                            ],
                            "total": [{ $group: { _id: "_id",    count: { "$sum": 1 } } }],
                        },
                    }
                ],
            ).toArray()
            .then(res => {
              response=res[0]
            }).catch(err => {
              console.log("Error: Update unsuccessfull.")
            })

            return response;
        }
        catch(error){
            console.error(`Unable to get count: ${error}`)
            return { error: error }
        }
    }
    static async updateEntry(Email, AddSubjects){
        try {
            const updateResponse = await scheduleClient.updateOne(
                {
                    "email":Email
                },
                [
                    {
                        $addFields: {
                            "email": Email ,
                            "subjects" : AddSubjects
                        } 
                    }
                ],
                {upsert:true}
            )
            return updateResponse
        }
        catch(error){
            console.error(`Unable to update/create user: ${error}`)
            return { error: error }
        }
    }
    static async studentData(Email){
        try {
            var response
            console.log(Email)
            const studentDataResponse = await scheduleClient.aggregate([
                {
                    $match: {email:Email}
                }
            ]).toArray()
            .then(res => {
              response=res[0]
            }).catch(err => {
              console.log("Error: Update unsuccessfull.")
            })
            console.log(response)
            return response;
        }
        catch(error){
            console.error(`Unable to fetch student data for scheduler: ${error}`)
            return { error: error }
        }
    }
    static async findBySubject(Subject){
        try {
            var response
            const findSubjectResponse = await scheduleClient.aggregate([
                {
                    $match:{
                        "subjects":
                            {$eq:Subject},
                    }
                }
            ]).toArray()
            .then(res => {
              response=res
            }).catch(err => {
              console.log("Error: Update unsuccessfull.")
            })
            
            return response;
        }
        catch(error){
            console.error(`Unable to fetch students by subject for scheduler: ${error}`)
            return { error: error }
        }
    }
}
