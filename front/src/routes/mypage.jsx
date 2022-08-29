import db from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { useAuthContext } from '../context/authContext';
import { LineAuthLink } from '../components/line/lineAuthLink';
import { useState } from 'react';

import axios from "axios";

import UserInfo from "../components/userinfo/userinfo";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const baseURL = "https://api.ouraring.com/v1/userinfo?access_token=";


export default function Mypage() {
    
  const { user } = useAuthContext();

  const [ouraKey, setOuraKey] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const uid = user.uid;
  const userRef = doc(db, 'users', uid);

  const userProfile = UserInfo();
  console.log("userProfile", userProfile)
  const profile = userProfile.userinfo;
  console.log("profile", profile)

  const GetOuraUserInfo = () => {
    axios.get(baseURL+profile.ourakey).then((response) => {
      //apiで取得データを格納
      const ouraUserData = response.data;
      setDoc(userRef, { 
        gender: ouraUserData.gender,
        age: ouraUserData.age,
        height: ouraUserData.height,
        weight: ouraUserData.weight,
      }, { merge: true });
      
    });
  };

  const updateOuraAPIkey = async () => {
    setError(false)

    if (ouraKey === "") {
      setError(true);
      return
    }
    try {
      setDoc(userRef, { 
        ourakey: ouraKey,
      }, { merge: true });
      setSuccess(true);
      setOuraKey("");
    } catch (err) {
      console.log(err)
      setError(true)
    }

    
  };

  return (
      <main style={{ padding: "1rem 0" }}>
        <Typography variant="h2">Mypage</Typography>

        <Box mb={3}>
          <Card sx={{borderRadius:"10px", paddingBottom: "20px"}}>
              <Typography variant="h3">{ profile ? profile.username : "" }</Typography>
              <Stack spacing={3} direction="column">
                <p>email: { profile ? profile.email : "" }</p>
                <p>gender: { profile ? profile.gender : "" }</p>
                <p>age: { profile ? profile.age : "" }</p>
                <p>weight: { profile ? profile.weight : "" }</p>
                <p>height: { profile ? profile.height : "" }</p>
              </Stack>
          </Card>
        </Box>

        <Box mb={3}>
          <Card sx={{borderRadius:"10px", paddingBottom: "20px"}}>
            <Typography variant="h3">OURA ring setup</Typography>

            <Box mb={4}>
              <Typography variant="body1">OURA ring APIを登録してください。</Typography>
              <Stack spacing={3} direction="row">
                <TextField id="standard-basic" label=" OURA API key" variant="standard" value={ouraKey} onChange={e => setOuraKey(e.target.value)}/>
                <Divider />
                <Button 
                  onClick={() => updateOuraAPIkey()} 
                  variant="outlined" 
                  sx={{color: "#3f8b6b", border:"1px solid #3f8b6b", borderRadius:"10px"}}
                  >update</Button>
                {error && <Alert severity="error">送信できませんでした</Alert>}
                {success && <Alert severity="success">更新しました</Alert>}
              </Stack>
            </Box>
              
            <Box>
              <Typography variant="body1">OURA ring APIを登録してください。</Typography>
              <Button 
                onClick={GetOuraUserInfo} 
                variant="outlined"
                sx={{color: "#3f8b6b", border:"1px solid #3f8b6b", borderRadius:"10px"}}
              >get Oura User Information</Button>              
            </Box>

          </Card>
        </Box>

        <Box mb={3}>
          <Card sx={{borderRadius:"10px", paddingBottom: "20px"}}>
            <Typography variant="h3">About LINE notice</Typography>
            <Stack spacing={3} direction="column">
              <LineAuthLink />
            </Stack>
          </Card>
        </Box>



        
      </main>
    );
}