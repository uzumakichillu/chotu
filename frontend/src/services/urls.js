import instance from "./http-common.js"
//functions deal with API calls and return the result to components
class UrlDataService {
  //different functions which will be called on frontend for making call to backend
  //using parameters obtained from frontend

  //these urls when appended to baseURL will make CORS request 
    createUrl() {
      return instance.post(`/url/shorten`);
    }
  
    get(code) {
      return instance.get(`/?code=${code}`);
    }

    login(Email,Password){
      return instance.post('/login', {email: Email, password: Password})
    }

    register(Email, Password, Name, Subjects){
      return instance.post('/register', {email:Email, password:Password, name:Name, subjects:Subjects})
    }

    getVideos(Subjects){
      return instance.post('/getVideos', {subjects:Subjects})
    }

    getCountData(){
      return instance.post('/scheduler/count')
    }

    getStudentData(Email){
      return instance.post('/scheduler/student', {email:Email})
    }

    deleteStudent(Email){
      return instance.delete('/scheduler/delete', {email:Email})
    }

    updateStudent(Email,AddSubjects){
      return instance.post('/myScheduler/update', {email:Email, addSubjects: AddSubjects})
    }

    getCronData(Number){
      return instance.post('/scheduler/cronJobs', {number:Number})
    }
}
  
export default new UrlDataService();