import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';


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
          console.log("登録");
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
        <h2>Signup</h2>
        {error && <p style={{color:'red'}}>{error}</p>}
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>メールアドレス</label>
              <input name="email" type="email" placeholder="email" ref={emailRef} />
            </div>
            <div>
              <label>パスワード</label>
              <input name="password" type="password" ref={passwordRef} />
            </div>
            <div>
              <button>登録する</button>
            </div>
          </form>
        </div>
      </main>
    );
}



