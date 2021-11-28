import React, {useState} from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Main from './components/Main/Main';
import Room from './components/Room/Room'
import styled from 'styled-components';
import StartPage from "./meet/startPage";

import VideoRecommendations1 from './meet/videoRecommend1';

import Login1 from './login/login1';
import FrontPage1 from './components/Scheduler/FrontPage1';

function App() {
  const [subjects, setSubjects] = useState()
  const [name, setName] = useState()
  const [videos, setVideos] = useState([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [initialSubjects, setInitialSubjects] = useState([])

  return (
    
      <BrowserRouter>
        <Switch>
        
          <Route exact path="/api/meet" component={StartPage} />

          <Route exact path="/api/getVideos" 
            render = {(props) => (
            <VideoRecommendations1
            {...props} videos={videos} subjects={subjects} setVideos={setVideos}
            />
          )}/>

          <Route exact path="/api/scheduler" 
            render = {(props) => (
            <FrontPage1
            {...props} email={email}
            />
          )}/>

          <Route exact path="/" render = {(props) => (
              <Login1 {...props} 
              setName={setName} setSubjects={setSubjects} setEmail={setEmail} email={email}
              subjects={subjects} name={name} password={password} setPassword={setPassword}
              />
          )}/>
         
          <AppContainer>
            <Route exact path="/api/redirect/:longUrl/video" component={Room} />
            <Route exact path="/api/redirect/:longUrl" component={Main}/>
          </AppContainer>
          
        </Switch>
      </BrowserRouter>
 
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
  overflow-y:hidden
`;

export default App;
