import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../../services/authService";
import toast from "react-hot-toast";

const Login: React.FC = () => {
    const {mutate, isPending} = useLoginUser()
    const navigate = useNavigate()
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: { email?: string; password?: string } = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      return errors;
    },
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: ()=> {
          navigate("/")
          localStorage.setItem("isLogin", "true")
          toast.success("Login success!")
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error:any)=> {
          toast.error(error?.response.data.message || "Login failed")
        }
      })
    },
  });
  
  return (
    <div className="bg-[#F7941D] h-screen w-screen">
      <div className="mx-auto w-fit">
        <div className="flex justify-center">
          <img src="./mentoons-logo.png" alt="" className="h-32 " />
        </div>
        <h2 className="text-center text-2xl font-bold">Sign In</h2>
        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <br />
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Enter your email"
              className="border p-3 outline-none rounded-lg border-white w-full placeholder:text-white placeholder:text-sm"
            />
              {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <br />
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Enter your password"
              className="border p-3 outline-none rounded-lg border-white w-full placeholder:text-white placeholder:text-sm"
            />
              {formik.touched.password && formik.errors.password && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <h5 className="text-center text-sm text-[#FFFFFF]">
            Don't have an account?{" "}
            <Link className="text-blue-700" to="/register">
              Create account
            </Link>
          </h5>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#FFFFFF]  w-56 py-3 rounded-lg cursor-pointer font-bold"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
