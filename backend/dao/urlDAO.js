import shortid from 'shortid'
let urlClient

export default class UrlsDAO {
    //Creating connection with MongoDB
    static async injectDB(conn){
        if(urlClient){
            return
        }
        try {
            urlClient = await conn.db("URLShortener").collection("url")
        }
        catch(e){
            console.error(`Unable to establish a connection handle in RestaurantsDAO: ${e}`)
        }
    }

    //creating a short URL for long URL
    //creating a (key,value) pair for (longUrl,shortUrl) and inserting in collection
    static async createUrl(LongUrl){
        try {
            let url = await urlClient.findOne({longUrl:LongUrl})

            if(url){
                return url.shortUrl;
            }
            else {
                
                const UrlCode = shortid.generate()
                const ShortUrl = `http://localhost:5000` + '/api/' + UrlCode
                const urlDoc = {
                    urlCode:UrlCode,
                    longUrl:LongUrl,
                    shortUrl:ShortUrl,
                    date:new Date()
                }

                const createResponse = await urlClient.insertOne(urlDoc)

                return ShortUrl;
            }
        }
        catch(error){
            console.error(`Unable to create Url: ${error}`)
            return { error: error }
        }
    }
    //fetch longUrl (value) using UrlCode (key)
    static async getUrl(UrlCode){
        try {
            const url = await urlClient.findOne({urlCode:UrlCode})

            console.log(url)
            if(url){
                return url.longUrl
            }
        }
        catch(error){
            console.error(`Unable to get Url: ${error}`)
            return { error: error }
        }
    }
}