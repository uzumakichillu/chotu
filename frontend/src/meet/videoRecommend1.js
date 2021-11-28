import React, {Component, useContext} from 'react'
import { Link, Redirect } from 'react-router-dom'
import { IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UrlDataService from '../services/urls'
import './videoRecommendation.css'


export default class VideoRecommendations1 extends Component{
    
    
    constructor(props) {
        super(props);
        
        this.state = {
          prevScrollpos: window.pageYOffset,
          visible: true,
          videos:[],
          subjects:this.props.subjects,
          loading:true
        }

    }
    //fetch data from YouTube with keywords as subjects
    async componentDidMount() {
        const videoDataResponse = await UrlDataService.getVideos(this.state.subjects)
        const responseData = videoDataResponse.data.success
        this.setState({videos:responseData, loading:false})
        window.addEventListener("scroll", this.handleScroll);
        
    }
    //making navbar scrollable
    handleScroll = () => {
        const { prevScrollpos } = this.state;
    
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollpos > currentScrollPos;
    
        this.setState({
          prevScrollpos: currentScrollPos,
          visible
        });
      };
    
      
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    render(){
      
      return(
        
        <div>
          {localStorage.getItem('email') === null ? <Redirect to='/'/> : 
          <div>
          {this.state.loading ? 
          <div>
             <div class="text">CONNECTING</div>
                <div class="box">
                <div class="comp"></div>
                <div class="loader"></div>
                <div class="con"></div>
                <div class="byte"></div>
                <div class="server"></div>
              </div>
          </div>:
          <div>
              <div class="bg" style={{backgroundImage:"linear-gradient(-60deg, rgb(172, 172, 172) 50%, rgb(0, 0, 0) 25%, rgb(6, 40, 85) 25%"}}></div>
              <div class="bg bg2"></div>
              <div class="bg bg3"></div>
              <div>
              <nav className="navbar navbar-expand navbar-dark bg-dark navbar__custom fixed-top"
                   style={{top: this.state.visible ? '0' : '-60px',background:"transparent"}}>
                    <Link to="#" className="navbar-brand">PEERify</Link>
        
        
                    <div className="navbar-nav mr-auto navbar__items">
                        <Link to="/api/meet" className="navbar-brand" title="Click to go to PEERify meet">Join Meet</Link>
                        <Link to="/api/scheduler" className="navbar-brand" title="Click to check your scheduler">My Scheduler</Link>
                        <IconButton>
                            <HelpOutlineIcon style={{color: '#FFFFFF'}}/> 
                        </IconButton>

                        <div class="collapse navbar-collapse " id="navbarNavDarkDropdown" style={{color:"white"}}>
                          <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                              <a class="nav-link " href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Account details">
                                <AccountCircleIcon style={{paddingBottom:"10%"}}/>
                              </a>
                              <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDarkDropdownMenuLink" style={{minWidth:"250px"}}>
                                <span style={{color:"white", padding:"10%", justifyContent:"center"}}>
                                    <li><span style={{alignContent:"center", paddingLeft:"28%", paddingRight:"15%", display:"list-item"}}>{localStorage.getItem('name') || 'name'}</span></li>
                                    <li><span style={{alignContent:"center", paddingLeft:"25%", paddingRight:"20%"}}>{localStorage.getItem('email') || 'email'}</span></li>
                                    <li><span style={{alignContent:"center"}}><a href="http://localhost:3000/" style={{color:"white", paddingLeft:"25%", paddingRight:"15%"}}
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
            

                <div style={{overflowY:"auto", paddingTop:"70px", justifyContent:"center"}}>
                    {this.state.videos && this.state.videos.map(video => {        
                    return (
                        <div style={{display:"flex", margin:"2%",boxShadow:"20px 20px 50px grey"}} 
                            onClick={()=>window.open(`https://www.youtube.com/watch?v=${video.videoId}`,'_blank')} 
                            key={video.key} title="Click to watch the video">
                        
                          <div styles={{flex:0.35}}>
                            <img src={video.thumbnail.url} width={video.thumbnail.width} height={"100%"}></img>
                          </div> 
                          <div class="row-md-6 position-static p-4 pl-md-0">
                              <h5 class="mt-0">{video.title}</h5>
                              <p>{video.time}</p>
                              <p>{video.channelName}</p>
                              <p>{video.description}</p>  
                          </div>
                        </div>)
                      })
                    }
                </div>
            </div>
        </div>}
        </div>}
    </div>)}
  }
