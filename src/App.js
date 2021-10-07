import './App.css';
import initializeAuthentication from './Firebase/firebase.int';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';

const googleProvider = new GoogleAuthProvider();

initializeAuthentication();

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const auth = getAuth();


  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user
        console.log(user)
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const handleEmail = e => {
    setEmail(e.target.value);
  }

  const handlePassword = e => {
    setPassword(e.target.value);
  }

  const handleSignup = e => {
    console.log(email, password);
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at last 6 character!!')
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password Must Contained Two Uppercase!!')
      return;
    }
    isLogin ? processLogin(email, password) : createNewUser(email, password);

  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => {

      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        // const user = result.user;
        console.log(result);
      })
  }

  const handlePasswordRes = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result);
      })
  }

  const handleName = e => {
    setName(e.target.value)
  }

  return (
    <div className="mx-5 my-5">
      <form onSubmit={handleSignup}>
        <h4 className="text-primary text-center my-4">Please {isLogin ? 'Sign in' : 'Signup'}</h4>
        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleName} type="name" className="form-control" id="inputName" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onChange={handleEmail} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onChange={handlePassword} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Sign in' : 'Sign up'}</button>
        <button onClick={handlePasswordRes} type="button" className="btn btn-secondary btn-sm mx-4">Reset Password</button>
      </form>
      <br /><br /><br /><br /><br />
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div>
  );
}

export default App;
