// SignUp.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Register.css";
import Logo from "./Frame 7.png";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    // add class name to the signUp page
    <div className="signUp-container">
      <div className="signUp-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Create your account</h3>
          <div>
            <label htmlFor="name"></label>
            <input
              id="name"
              placeholder="Name"
              type="text"
              {...register("name")}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>
          <div>
            <label htmlFor="email"></label>
            <input
              id="email"
              placeholder="Email"
              type="email"
              {...register("email")}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label htmlFor="password"></label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <button type="submit" className="signUp-button">
            Sign Up
          </button>
          <div className="signUp-terms-container">
            <p>
              By signing up you agree to our Terms of Service and Privacy
              Policy, and confirm that you are at least 18 years old.
            </p>
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </form>
        <div className="signUp-image-container">
          <img src={Logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
