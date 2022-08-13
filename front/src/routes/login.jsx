import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef,useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';




export default function Login() {

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
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          console.log("ログイン");
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
        <Container maxWidth="sm">
        <Box>
          <h2>Login</h2>
        
          {error && <p style={{color:'red'}}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} direction="column">

            <TextField name="email" id="email" label="メールアドレス" variant="outlined" defaultValue="" type="email" inputRef={emailRef}/>
            <TextField name="password" id="password" label="パスワード" variant="outlined" defaultValue="" type="password" inputRef={passwordRef}/>

              <Button variant="contained" type="submit">ログインする</Button>
              <div>
                ユーザー登録は<Link to={'/signup'}>こちら</Link>
              </div>
            </Stack>
          </form>
          <Paper />
          </Box>
        </Container>

      </main>
    );
}



