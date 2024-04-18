import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../Styles/styles";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const newForm = new FormData();
    newForm.append("file", avatar); 
    newForm.append("name", name); 
    newForm.append("email", email);
    newForm.append("password", password);

    axios
      .post(`${server}/create-user`, newForm, config)
      .then((res) => {
        // if (res.data.success === true) {
        //   navigate("/login");
        // }
        toast.success(res.data.message)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar("")
        navigate("/login")
      })
      .catch((err) => {
        toast.error(err.response.data.message)
      });
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg
    px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SignUp to Your Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-yellow-500">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  className="block w-full px-3 py-2 border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-gray-100"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  className="block w-full px-3 py-2 border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-gray-100 "
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  className="block w-full px-3 py-2 border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-gray-100"
                  type={visible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                {visible ? (
                  <AiOutlineEye
                    onClick={() => setVisible(false)}
                    size={25}
                    className="absolute right-2 top-2 cursor-pointer"
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    onClick={() => setVisible(true)}
                    size={25}
                    className={`absolute right-2 top-2 cursor-pointer ${
                      password ? "block" : "hidden"
                    } }`}
                  />
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="avatar"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      className="h-full w-full object-cover rounded-full"
                      alt="avatar"
                      src={URL.createObjectURL(avatar)}
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8 text-gray-300" />
                  )}
                </span>
                <label
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  htmlFor="file-input"
                >
                  <span>Upload Your Profile</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.heic,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                className="group  w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <div className={`${styles.normalFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link className="text-blue-600 pl-2" to="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;