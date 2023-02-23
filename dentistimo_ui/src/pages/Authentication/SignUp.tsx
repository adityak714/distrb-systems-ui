// code reference: https://www.freecodecamp.org/news/add-form-validation-in-react-app-with-react-hook-form/
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import "./SignUp.css"
import { publish, connectMQTT, createUser } from '../../Infrastructure/PMQTTController';
import { User } from './UserType';
import { EMAIL_REGEX, PASSWORD_REGEX } from "./Regex";
import { ToastContainer } from "react-toastify";

export function SignUp(){
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
  
    useEffect(() => {
      try {
          connectMQTT();
      } catch (e) {
          console.log(e);
      }
  })
  
    return (
      <form className="SignUp-form" onSubmit={handleSubmit(createUser)}>
        <ToastContainer
          position="bottom-center"
          draggable
          theme="colored"
          hideProgressBar />
      <div className="wrapper">
        <header id ="header">Sign up</header>
     
          <input
              id="name"
              type='text'
              placeholder="Enter your full name"
              {...register("name", { required: true, minLength: 3, maxLength: 40 })} />
              {errors.name && <div className="form-value">Name is required</div>}
        
       
          <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: true, pattern: EMAIL_REGEX })} />
              {errors.email && <div className="form-value">Email is required and must follow the example@domain.com template</div>}
       
       
          <input
              id="password"
              type="password"
              placeholder="Enter your password"
            //the password should include capital letters and lowercase letters. From 8 to 30 characters
              {...register("password", { required: true, minLength: 8, pattern: PASSWORD_REGEX })} />
              {errors.password && <div className="form-value">Password is required and should be more than 8 characters. It Should include at least one Capital letter, lowercase letter and a number</div>}
       
        <div className="pass-txt">
          <a href="./">Already have an account? click here</a>
        </div>
        <button type="submit" value="Sign up" > Sign Up </button>
      </div>
    </form>
    )
}