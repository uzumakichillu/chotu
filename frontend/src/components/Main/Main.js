import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import socket from '../../socket';

const Main = (props) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [roomName, setRoomName] = useState()
  useEffect(() => {

    //checking if valid (unique userName) user with enters the room
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) {
        //redirect user to the room
        const userName = userRef.current.value;

        sessionStorage.setItem('user', userName);
        const myArray = window.location.href.split("/");
        props.history.push('/api/redirect/'+myArray[5]+'/video');
        
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history]);

  function clickJoin() {
    //check username entered before joining
    const userName = userRef.current.value;

    if (!userName) {
      setErr(true);
      setErrMsg('Enter User Name');
    } else {
      const myArray = window.location.href.split("/");
      console.log(myArray)
      setRoomName(myArray[5])
      socket.emit('BE-check-user', { roomId: roomName, userName });
      
    }
  }

  return (
    
    <MainContainer>
      <h1 style={{color:"white", paddingTop:"1.2%", paddingLeft:"1.5%"}}>PEERify Meet</h1>
      <Row>
        <Label htmlFor="userName">User Name</Label>
        <Input type="text" id="userName" ref={userRef} />
      </Row>
      <JoinButton onClick={clickJoin} styles={{margin:"10%"}}> Join </JoinButton>
      {err ? <Error>{errMsg}</Error> : null}
    </MainContainer>
    
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;


export default Main;
