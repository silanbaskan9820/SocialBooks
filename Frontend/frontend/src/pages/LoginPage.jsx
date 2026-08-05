import { login } from "../services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(formData);

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      //console.log(data);

      navigate("/")

    } catch (error){

      console.error(error);
      /*console.error("Login Error:", error);

  //console.log("Response:", error.response);
  //console.log("Data:", error.response?.data);
  //console.log("Status:", error.response?.status);*/

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">

            <h2 className= "text-3xl font-tight text-center mt-2">
              Welcome
            </h2>

                <p className="text-center text-base-content/70 mb-4">
                Sign in to continue
                </p>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
               <label className="label">
                <span className="label-text">E-mail</span>
               </label>

                 <input
                 type="email"
                 name="email"
                 placeholder="Enter your e-mail"
                 className="input input-bordered w-full"
                 value={formData.email}
                 onChange={handleChange}
                 />
                 </div>

               <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
              
                <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange}
                />  
                </div> 
                
                <button
                type="submit"
                className="btn btn-primary w-full"> 
                Login 
                </button>

            </form>

                <p className="text-center mt-4">
                  Don't have an account?{" "}
                  <Link 
                  to="/register"
                  className="text-primary font-semibold hover:underline">
                    Register
                  </Link>
                  </p>

          </div>

        </div>

    </div>
  );
};

export default LoginPage;