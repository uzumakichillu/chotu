import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UrlDataService from '../../services/urls'
import  { Redirect } from 'react-router-dom'

import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import Typist from 'react-typist';

import { Chart } from "react-google-charts";


import './FrontPage1.css'
import "bootstrap"


export default class FrontPage1 extends Component{

    
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            

            prevScrollpos: window.pageYOffset,
            visible: true,
            currentCountData:[],
            
            email:this.props.email,
            AddedSubjects: [], 
            initialSubjects: [],
            optionSelected:[],
            AllSubjects: [
                { value: "Data Structures", label: "Data Structures"},
                { value: "Algorithms", label: "Algorithms"},
                { value: "Physics", label: "Physics" },
                { value: "Chemistry", label: "Chemistry" },
                { value: "Maths", label: "Maths" },
                { value: "English", label: "English" },
                { value: "Analog Electronics", label:"Analog Electronics"},
                { value: "Deep Learning", label: "Deep Learning"},
                { value: "Operating Systems", label: "Operating Systems"}
            ],
            loading:true,
            buttonClicked:false,
            submitClicked:false,

            cronData: [],
            latestCronData: []
        }
        
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    //on clicking the button, set state of button
    handleClick() {
       
            console.log("button clicked")
            console.log(this.state.initialSubjects)

           this.setState({buttonClicked:!(this.state.buttonClicked)})
    }
   
    
    
    //after first rendering of page, this will be called on change of state
    async componentDidMount(){
        const countResponse = await UrlDataService.getCountData()
        const data1 = countResponse.data

        //collect data for chart 1
        var initialList = [['subjects','count']]
        if(data1.subjects.length){
            for(var i=0 ; i<data1.subjects.length ; i++){
                initialList.push([data1.subjects[i]._id, data1.subjects[i].count])
            }
        }
        else initialList.push(['No subject enrolled',1])


        //collect data (if subjects already added) for dropdown of enroll button 
        const studentDataResponse = await UrlDataService.getStudentData(this.props.email)
        const data2 = studentDataResponse.data
        
        var InitialSubjects=[""] ;
        if(data2.subjects){
            InitialSubjects=data2.subjects.map(item => {
                return {value:item, label:item}
            });
            localStorage.setItem('initialSubjects',JSON.stringify(InitialSubjects))
        }
        else InitialSubjects=[]

        
        //collect cron job data of last 30 days
        const cronDataResponse = await UrlDataService.getCronData(30)
        const data3 = cronDataResponse.data
        console.log(data3)

        //for latest crondata
         var LatestCronData=[['subjects','count']]
        for(var i=0 ; i<data3[0].subjects.length-2 ; i++){
            LatestCronData.push([data3[0].subjects[i].subject,data3[0].subjects[i].count])
        }


        // //for overall crondata
        var OverallCronData=[]
        OverallCronData = [["Date", "Student Participated", "Student Left Unpaired"]]
        for(var i=data3.length-1 ; i>=0 ; i--){
            var n=data3[i].subjects.length
            OverallCronData.push([data3[i]._id,data3[i].subjects[n-2].count,data3[i].subjects[n-1].count])
        }
        
        this.setState({currentCountData:initialList, loading:false, initialSubjects:InitialSubjects,cronData:OverallCronData,
        latestCronData:LatestCronData})
        console.log(this.state)

    }
    handleSubmit = async e => {
        e.preventDefault();
        
        //on clicking submit button, update student's document in Scheduler collection
        await UrlDataService.updateStudent(localStorage.getItem('email'),this.state.AddedSubjects)
        .then(response=>{
            console.log(response.data)
            var added = []
            for(var i=0 ; i<this.state.AddedSubjects.length ; i++){
                added.push({value:this.state.AddedSubjects[i], label:this.state.AddedSubjects[i]})
            }
            localStorage.setItem('initialSubjects',JSON.stringify(added))
        })
        
        var flag = !this.state.submitClicked
        this.setState({buttonClicked:!(this.state.buttonClicked), submitClicked:flag})
        window.location.reload(false);

    }

    render(){

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
        
        //handling change of options of dropdown menu
        const handleChange = (selected) => {
            this.setState({optionSelected:selected})
            let values = []; 		
            selected.map((v) => values.push(v.value));
            this.setState({AddedSubjects:values})
            console.log(this.state.AddedSubjects)
        }

        return (
            <div>
                {localStorage.getItem('email')===null ? <Redirect to='/'/>:<div>
                {this.state.loading? 
                <div>
                    <div class="text">CONNECTING</div>
                        <div class="box">
                        <div class="comp"></div>
                        <div class="loader"></div>
                        <div class="con"></div>
                        <div class="byte"></div>
                        <div class="server"></div>
                    </div>
                </div> : 
                    
                <div>
                    <nav className="navbar navbar-expand navbar-dark navbar__custom fixed-top"
                         style={{background:"transparent"}}>
                        <Link to="#" className="navbar-brand">PEERify</Link>


                        <div className="navbar-nav mr-auto navbar__items" >
                            <Link to="/api/meet" className="navbar-brand" title="Click to go to PEERify meet">Join Meet</Link>

                            <button class="btn btn-outline-light my-2 my-sm-0" type="button"
                            style={{marginTop:"10%"}} onClick={this.handleClick} title="Enroll in today's discussion">Enroll</button>
        
                            <div class="collapse navbar-collapse " id="navbarNavDarkDropdown" style={{color:"white", background:"transparent"}}>
                                <ul class="navbar-nav">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link " href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" 
                                        aria-expanded="false" title="Account details">
                            
                                            <AccountCircleIcon style={{paddingBottom:"10%"}}/>
                            
                                        </a>
                                        <ul class="dropdown-menu  dropdown-menu-end" aria-labelledby="navbarDarkDropdownMenuLink" style={{minWidth:"240px", background:"transparent"}}>
                                            <span style={{color:"black", padding:"10%", justifyContent:"center"}}>
                                                <li><span style={{alignContent:"center", paddingLeft:"28%", paddingRight:"15%", display:"list-item"}}>
                                                    {localStorage.getItem('name') || 'name'}</span></li>
                                                <li><span style={{alignContent:"center", paddingLeft:"25%", paddingRight:"20%"}}>
                                                    {localStorage.getItem('email') || 'email'}</span></li>
                                                <li><span style={{alignContent:"center"}}><a href="http://localhost:3000/" style={{paddingLeft:"25%", paddingRight:"15%"}}
                                                onClick={()=>{
                                                    localStorage.clear()
                                                }}>Log Out</a></span></li>
                                            </span>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div class="jumbotron">
                        <div class="bg"></div>
                        <div class="bg bg2"></div>
                        <div class="bg bg3"></div>
                        <div class="content">
                            <h3 class="block-effect" >
                                <div class="block-reveal">P2P Discussions</div>
                                <div id ="subtext" class="block-reveal">Have doubts? Discuss with your friends</div> 
                            </h3>
                            
                            <div id ="subtext" class="block-reveal">Enroll today and receive links on your email to connect with your peers</div>  
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center', width:"90%", paddingLeft:"100px"}}>
                                <Chart
                                    width={'200%'}
                                    height={'300px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.currentCountData}
                                    options={{
                                        title: 'Students enrolled for today\'s discussion',
                                        // Just add this option
                                        is3D: true,
                                        backgroundColor:'transparent'
                                    }}
                                    rootProps={{ 'data-testid': '2' }}
                                /> 
                                    
                                    
                                <Chart
                                    width={'200%'}
                                    height={'300px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.latestCronData}
                                    options={{
                                        title: 'Students stats from yesterday\'s discussion',
                                        // Just add this option
                                        is3D: true,
                                        backgroundColor:'transparent'
                                    }}
                                    rootProps={{ 'data-testid': '2' }}
                                /> 
                                    <Chart 
                                        width={'200%'}
                                        height={'300px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart</div>}
                                        data={this.state.cronData}
                                        options={{
                                            title: "Students enrolled to this date",
                                            curveType: "function",
                                            legend: { position: "bottom" },
                                            hAxis: {
                                                title: 'Data',
                                            },
                                            vAxis: {
                                                title: 'Number of students',
                                            },
                                            backgroundColor:"transparent"
                                        }}
                                    />
                                </div>   
                            </div>
                        </div>
                        <div className={`${this.state.buttonClicked? "":"active"} show`} 
                        style={{position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",padding:"2%",
                        }}>
                   

                   <form onSubmit={this.handleSubmit} >
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        required="true" value={localStorage.getItem('email')} style={{width:"80%"}} spellCheck={false}></input>
                    </div>
                                    
                    <div class="mb-3" style={{padding:"1%"}}> 
                        <span
                            class="d-inline-block"
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Please selecet account(s)"
                            style={{width:"100%"}}
                        >
                        Subjects enrolled for discussion
                        {localStorage.getItem('email') && <ReactSelect
                            options={this.state.AllSubjects}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={true}
                            defaultValue={(localStorage.getItem('initialSubjects') && JSON.parse(localStorage.getItem('initialSubjects'))) || this.state.initialSubjects}
                            components={{
                                Option
                            }}
                            onChange={handleChange}
                            allowSelectAll={true}
                        /> }
                        
                        </span>
                    </div> 
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
                </div>
               </div>
                    

                }
                </div>}
            </div>
            
        )
    }








    handleScroll = () => {
        const { prevScrollpos } = this.state;
    
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollpos > currentScrollPos;
    
        this.setState({
          prevScrollpos: currentScrollPos,
          visible
        });
      };
    
    //   Remove the event listener when the component is unmount.
    // componentWillUnmount() {
    //     window.removeEventListener("scroll", this.handleScroll);
    // } 
  
}

