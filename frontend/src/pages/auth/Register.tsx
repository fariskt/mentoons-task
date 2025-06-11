import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../../services/authService";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const { mutate, isPending } = useRegisterUser();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: {
        firstname?: string;
        lastname?: string;
        email?: string;
        password?: string;
      } = {};

      if (!values.firstname) {
        errors.firstname = "firstname is required";
      } else if (values.firstname.length < 2) {
        errors.firstname = "Firstname must be at least 2 characters";
      }
      if (!values.lastname) {
        errors.lastname = "lastname is required";
      } else if (values.lastname.length < 2) {
        errors.lastname = "Lastname must be at least 2 characters";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
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
        onSuccess: () => {
          navigate("/login");
          toast.success(
            "Registration completed, Please login with credentials"
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error:any) => {
          const message =error.response?.data?.message || "Registration failed";
          toast.error(message);
        },
      });
    },
  });

  return (
    <div className="bg-[#F7941D] min-h-screen w-screen md:p-10 p-2">
      <div className="mx-auto w-fit">
        <div className="flex justify-center">
          <img src="./mentoons-logo.png" alt="" className="h-32 " />
        </div>
        <h2 className="text-center text-2xl font-bold">Sign Up</h2>
        <form className="space-y-7 md:mx-0 mx-5" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <div className="flex space-x-3 text-white">
              <div>
                <input
                  type="text"
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  placeholder="First Name"
                  className="border p-3 outline-none rounded-lg border-white placeholder:text-white placeholder:text-sm md:w-full w-40"
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <p className="text-red-600 text-sm mt-1 h-1">
                    {formik.errors.firstname}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  placeholder="Last Name"
                  className="border p-3 outline-none rounded-lg border-white placeholder:text-white placeholder:text-sm md:w-full w-40"
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <p className="text-red-600 text-sm mt-1 h-1">
                    {formik.errors.lastname}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Enter your email"
              className="border p-3 outline-none rounded-lg border-white w-full placeholder:text-white placeholder:text-sm"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 text-sm h-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Enter your password"
              className="border p-3 outline-none rounded-lg border-white w-full placeholder:text-white placeholder:text-sm"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-600 text-sm h-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <h5 className="text-center text-sm text-[#FFFFFF]">
            Already have an account?{" "}
            <Link className="text-blue-700" to="/login">
              Login
            </Link>
          </h5>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#FFFFFF] w-full py-3 rounded-lg font-bold cursor-pointer"
            >
              {isPending ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
