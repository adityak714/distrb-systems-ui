import React, { useEffect } from 'react'
import "./Login.css";
import { connectMQTT, logIn } from '../../Infrastructure/PMQTTController';
import { User } from './UserType';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from './Regex';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface LoginPageProps {
  pageName: string;
  user?: {
    email: string, 
    password: string
  };
}

const Login = (props: LoginPageProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  
  useEffect(() => { document.title = `${props.pageName} ⋅ Dentistimo` });
  
  useEffect(() => {
    try {
        connectMQTT();
    } catch (e) {
        console.log(e);
    }
  })


  return (
    <form className="login-form" onSubmit={handleSubmit(logIn)}>
        <div className="wrapper">
        <header>Log in</header>
        <div>
        <input
          className="email"
          type="text"
          placeholder="Enter your email"
          {...register("email", { required: true, pattern: EMAIL_REGEX})} />
          {errors.email && <div className='form-value'>Please enter a valid email</div>}
        </div>

        <input
          className="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")} />
          {errors.email && <div className='form-value'>Please enter a valid password</div>}
            <div className="pass-txt">
            <a href="./SignUp">
              Don't have an account? Sign Up. 
              </a>
        </div>
        <ToastContainer
          position='bottom-center'
          autoClose={3000}
          draggable
          theme='colored'
          hideProgressBar
        />
            <button value="Login" type="submit"> Log in</button>
          </div>
      </form>
    ) 
}

export default Login;