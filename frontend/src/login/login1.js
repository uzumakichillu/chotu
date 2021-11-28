import React, {useState, useEffect} from 'react'
import UrlDataService from "../services/urls.js"
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import './login1.css'
import Typist from "react-typist";
import $ from 'jquery'

const subjectOptions = [
    { value: "Data Structures", label: "Data Structures"},
    { value: "Algorithms", label: "Algorithms"},
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Maths", label: "Maths" },
    { value: "English", label: "English" },
    { value: "Analog Electronics", label:"Analog Electronics"}
  ];
function Login1(props) {

    const [count, setCount] = useState(1);
    const [count1, setCount1] = useState(1);
    const [optionSelected, setOptionSelected] = useState()
    const [formState, setFormState] = useState('login')

    const {setSubjects, setName, setPassword, setEmail, subjects, email, name, password} = props


       

    useEffect(() => {
      console.log("Count: " + count);
      setCount(1);

    }, [count]);

   
   

    const Option = (props) => {
        return (
          <div>
            <components.Option {...props}>
              <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
              />{" "}
              <label>{props.label}</label>
            </components.Option>
          </div>
        );
      };
    const handleChange = (selected) => {
        setOptionSelected(selected)
        console.log(selected)
        let values = []; 		
        selected.map((v) => values.push(v.value));
        setSubjects(values)
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if(formState === 'register'){
            await UrlDataService.register(email,password,name,subjects)
            .then(response => {
                console.log(response.data)
                window.location.reload(false)
                setFormState('login')
                
            })
            .catch(e => {
                console.log("error is " + e);
            }); 
            
        }
        else {
            await UrlDataService.login(email,password).then(response =>{

                localStorage.setItem('email',email)
                localStorage.setItem('name',response.data.name)
                localStorage.setItem('subjects',JSON.stringify(response.data.subjects))
                setName(response.data.name)
                setEmail(response.data.email) 
                setSubjects(response.data.subjects)
                console.log(response.data)
                console.log('########')
                console.log(localStorage.getItem('subjects'))
                props.history.push('/api/getVideos')
            
            })
            .catch(e => {
                console.log("error is " + e);
            });
        }
    }
return (
  <body>
      <div>
          <div class="ripple-background">
          <div class="circle xxlarge shade1"></div>
          <div class="circle xlarge shade2"></div>
          <div class="circle large shade3"></div>
          <div class="circle mediun shade4"></div>
          <div class="circle small shade5"></div>
      </div>
      
      <div>
      <h1 style={{color:"white"}}>
        <div style={{float:"left", paddingTop:"1.2%", paddingLeft:"1.5%"}}>PEERify</div>
        
      </h1>
      <h1 style={{float:"right", paddingTop:"1.2%", paddingRight:"1.5%", font:"14px", color:"white"}} data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="Click to know about us">About</h1>
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">About Us</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style={{font:"12px"}}>
                  <span>
                    <p>
                      We present a solution to one of the biggest problems that has arisen in the pandemic i.e.,
                      the lack of interaction among the students and the distractions online mode has caused. 
                    </p>
                    <b>How will we help students?</b>
                    <p>
                      Our solution deals with the above mentioned problems by filtering and presenting 
                      relevant content from YouTube on the basis of the subjects student have enrolled in, which they
                      can discuss on our PEERify meeting platform. 
                    </p>
                    <p>
                      We also provide a scheduler which pairs students on the preference of their subjects for discussion.
                      This is done in unbiased fashion to promote interaction and useful discussions. 
                    </p>
                    
                    <b>What do teachers have in store?</b>
                    <p>
                      The pictorial representation of the daily interactions and overall figures of last 30 days are available.
                      Teachers can view this information and plan ways to increase the interest and involvement of students
                      in respective subjects.
                    </p>
                  </span>     
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={()=>setCount1(0)}>Close</button>
                </div>
            </div>
          </div>
      </div>
            
      
      <div style={{color:"white",paddingLeft:"1.5%", paddingTop:"5%"}}>
        {count ? (
          <Typist avgTypingDelay={150} onTypingDone={() => setCount(0)} >
            <span> Your one stop to interact with your peers</span>
            <Typist.Backspace count={60} delay={900} />
            <span> From amazing YouTube videos to interesting discussions</span>
          </Typist>
        ) : (
          ""
        )}
      </div>
      
      </div>
      <div className="container" style={{marginRight:"20%", marginBottom:"4%"}}>
        <div style={{transform: `translate(${formState === 'login' ? 0 : 250}px, 0px)`}} className="form-div">
          <form onSubmit={handleSubmit}>
            <input placeholder="Email" type="text"  onChange={e => setEmail(e.target.value)}/>
            <input placeholder="Password" type="password"  onChange={e => setPassword(e.target.value)}/>
            
            {formState === 'login'? '' : <input placeholder="Name" type="text"  onChange={e => setName(e.target.value)}/>}
            {formState === 'login' ? '': 
                    <div class="mb-3" style={{margin:"2%"}}>
                    <span
                        class="d-inline-block"
                        data-toggle="popover"
                        data-trigger="focus"
                        data-content="Please select account(s)"
                        style={{width:"80%"}}
                    >
                    <ReactSelect
                        options={subjectOptions}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={true} //hide
                        components={{
                            Option
                        }}
                        onChange={handleChange}
                        allowSelectAll={true}
                    />
                    
                    </span>
                    </div>
                }
            <button className="button-primary">Submit</button>
          </form>
        </div>
        <div style={{transform: `translate(${formState === 'login' ? 0 : -250}px, 0px)`}} className="button-div">
          <p style={{color:'white'}}>{formState === 'login' ? 'Do not have an account?' : 'Already a member?'}</p>
          <button style={{color:'grey', backgroundColor:'white'}}onClick={() => {
              if(formState==='login') {
                setFormState('register') 
                setName('')
                setEmail('')
                setPassword('')
              }
              else setFormState('login')}}>{formState=='login'? 'register' : 'login'}</button>
        </div>
      </div>
    </div>  
  </body>
  )
}



export default Login1
