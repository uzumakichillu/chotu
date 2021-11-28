import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"
import '../meet.css'
import { IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MeetStartOptions from "./meetStartOptions";

export default function StartPage() {
    
    return (
      <div style={{background:"white"}}>
        <nav className="navbar navbar-expand navbar-dark bg-dark navbar__custom fixed-top"
      >
        <a href="#" className="navbar-brand">
         PEERify
        </a>
        
        
        <div className="navbar-nav mr-auto navbar__items">
        <a class="nav-link" href="http://localhost:3000/api/scheduler">My Scheduler</a>
         
        <IconButton>
               <HelpOutlineIcon style={{color: '#FFFFFF'}}/> 
          </IconButton>
    
{localStorage.getItem('email')===null ? <div></div> :
<div class="collapse navbar-collapse " id="navbarNavDarkDropdown" style={{color:"white"}}>
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link " href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          
             <AccountCircleIcon style={{paddingBottom:"10%"}}/>
          
          </a>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDarkDropdownMenuLink" style={{minWidth:"240px"}}>
           
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
</div>}

          

         
        </div>
    
     </nav>

     

    
    <div className="startMeet__body">
      <MeetStartOptions/>
      </div>

        
     
  
    </div>
    
    );
}