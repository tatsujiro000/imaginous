import db from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import UserInfo from "../components/userinfo/userinfo";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from "axios";
import { useAuthContext } from '../context/authContext';


const baseURL = "https://api.ouraring.com/v1/userinfo?access_token=";


export default function Mypage() {
  const userProfile = UserInfo();
  const profile = userProfile.userinfo;


  const { user } = useAuthContext();

  const GetOuraUserInfo = () => {
    const uid = user.uid;
    const userRef = doc(db, 'users', uid);
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

  return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Mypage</h2>
        <h3>
          { profile ? profile.username : "" }
        </h3>
        <Stack spacing={2} direction="column">
          <p>email: { profile ? profile.email : "" }</p>
          <p>gender: { profile ? profile.gender : "" }</p>
          <p>age: { profile ? profile.age : "" }</p>
          <p>weight: { profile ? profile.weight : "" }</p>
          <p>height: { profile ? profile.height : "" }</p>
        </Stack>

        <Stack spacing={2} direction="row">
          <Button onClick={GetOuraUserInfo} variant="outlined">get Oura User Information</Button>
        </Stack>
      </main>
    );
}