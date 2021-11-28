import React, {useState, Component} from "react";
import '../meet.css'
import { IconButton } from "@mui/material";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import UrlDataService from '../services/urls.js'

function PositionedMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [url, setUrl] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getUrl()
  };
  const handleClose = () => {
    setAnchorEl(null);
    
  };
  
  const getUrl = () => {
    UrlDataService.createUrl()
      .then(response => {
        console.log(response.data);
        setUrl(response.data)
        return response.data
      })
      .catch(e => {
        console.log(e);
      });
  }
  

  return (
    <div className="float-child">
      <Button
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        type="button" class="btn btn-primary" style={{paddingRight:'7%', marginLeft:"-3%"}}
      ><VideoCallOutlinedIcon style = {{color : '#FFFFFF', paddingBottom:"4px"}}/>    New Meeting</Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        style={{paddingRight:"10%"}}
        >
       
        <MenuItem style={{color:"black"}} data-bs-toggle="modal" data-bs-target="#exampleModal" ><IconButton style={{color:"black"}}><LinkIcon/></IconButton>Create a meeting for later  </MenuItem>
        
        <MenuItem onClick={handleClose} style={{color:"black"}}
        onClick={()=>{
          window.open(`${url}`, '_blank')
        }}><IconButton style={{color:"black"}}><AddIcon/></IconButton>Start an instant meeting  </MenuItem>
        
     
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  
  <div class="modal-dialog modal-dialog-centered" style={{width:"1000px", padding:"5%", borderRadius:"5px"}}>
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title noselect" id="exampleModalLabel">Here's the link to your meeting</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body noselect" style={{font:"11px sans-serif solid grey"}}>
        Copy this link and send it to people that you want to meet with. Make sure that you save it so that
        you can save it later, too.
        <br></br>
        <br></br>
        <div style={{display:"flex", float:"left"}}>
              <text class="noselect" style={{paddingTop:"2%", width:"290px"}}>{url}</text>
              <IconButton style={{color:"#4f4d4d", fontSize:"large"}} onClick={()=>{navigator.clipboard.writeText(url)}}>
              <ContentCopyRoundedIcon/> 
              </IconButton>
        </div>
      </div>
    </div>
  </div>
</div>
      </Menu>
    </div>
  );
}

export default function MeetStartOptions(){
  
  const [inputState, setInputState] = useState("")
  const [visibleState, setVisibileState] = useState("hidden")
  const [borderState, setBorderState] = useState("1px solid grey")
  const [meetLater, setMeetLater] = useState(false)
  const handleChange = (e) =>{
    setInputState(e.target.value)
   
    if(e.target.value==='') {
      setVisibileState("hidden")
    }
    else setVisibileState("visible")
    
  }
 
    return (
        <div className="meetStartOptions__body">
                <text className="text1">Secure video conferencing for everyone</text>
                <br></br>
                <br></br>
                <text className="text2">Connect, collaborate, and celebrate from anywhere with PEERify</text>
                <br></br>
                <br></br>
                <div className="float-container">
                    {PositionedMenu()}
                    <div style={{border:borderState, borderRadius:"5px", width:"220px", padding:"0.2px"}} className="float-child"
                    onClick={()=>{
                      setBorderState("2px solid #4285F4")
                      
                    }}
                    onMouseOver={()=>{
                      setBorderState("1px solid black")
                    }}
                    onMouseLeave={()=>{
                      setBorderState("1px solid grey")
                    }}>
                      <IconButton style={{color : "grey"}}><KeyboardIcon/></IconButton>
                      <input placeholder="Enter a code or link" style={{outline:"none", border:"0px solid", width:"150px", marginTop:"5%"}} onChange={handleChange} value={inputState} spellCheck="false"></input></div>
                      <button class="btn-light float-child" style={{outline: "none", border:"0px solid",width:"20%",padding:"1%", visibility:visibleState, color:"#4285F4", font:"12px"}}
                      onClick={()=>{
                        window.open(`http://localhost:5000/api/${inputState}`, '_blank')
                      }}>Join</button>
                </div>
               
                
        </div>
    )
} 

