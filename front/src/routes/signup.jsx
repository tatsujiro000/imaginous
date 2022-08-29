import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import db from '../firebase';
import { doc, increment, setDoc, serverTimestamp } from "firebase/firestore";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import Typography from '@mui/material/Typography';

export default function Signup() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');



    const handleSubmit = async (event) => {
      event.preventDefault();
      const auth = getAuth();

      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      console.log(emailRef.current.value, passwordRef.current.value);
      console.log(email, password);
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);

          //firestoreになければ、userをcreate
          const userDoc = doc(db, "users", user.uid);
          if (!userDoc.exists) {
            setDoc(userDoc,{
              email: user.email,
              created_at: serverTimestamp(),
              uid: user.uid,
              id: increment(1)
            });
          }
          navigate('/top');

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(error.message);
          console.log(errorCode);
          console.log(errorMessage);
          console.log("失敗");
        });
    };

    return (
      <main style={{ padding: "1rem 0" }}>
        <CssBaseline />
        <Container maxWidth="sm">
        <Box>

        <Typography variant="h3">Signup</Typography>

        {error && <p style={{color:'red'}}>{error}</p>}
        <div>
          <form onSubmit={handleSubmit}>
          <Stack spacing={3} direction="column">

            <TextField 
              name="email" 
              id="email" 
              label="メールアドレス" 
              variant="standard" 
              defaultValue="" 
              type="email" 
              inputRef={emailRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField 
              name="password" 
              id="password" 
              label="パスワード" 
              variant="standard" 
              defaultValue="" 
              type="password" 
              inputRef={passwordRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
              <Stack alignItems="center">
                <Button type="submit" variant="contained">登録する</Button>
              </Stack>
            </Stack>

          </form>
        </div>
        <Paper />
          </Box>
        </Container>


      </main>
    );
}



