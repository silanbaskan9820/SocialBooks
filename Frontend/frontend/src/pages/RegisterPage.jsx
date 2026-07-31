import { register } from "../services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const data = await register(formData);
  
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
  
        console.log(data);
  
        navigate("/login")
  
      } catch (error){
  
        //console.error(error);

         console.error("Register Error:", error);
         
         console.log("Status:", error.response?.status);
         console.log("Data:", error.response?.data);
  
        toast.error(
          error.response?.data?.message || "Register failed"
        );
      }
    };

    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">

            <h2 className= "text-3xl font-tight text-center mt-2">
              Create your account
            </h2>

                <p className="text-center text-base-content/70 mb-4">
                Create a new account to continue
                </p>
              
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
               <label className="label">
                <span className="label-text">Username</span>
               </label>

                 <input
                 type="text"
                 name="username"
                 placeholder="Enter your username"
                 className="input input-bordered w-full"
                 value={formData.username}
                 onChange={handleChange}
                 />
                 </div>

                 <div>
               <label className="label">
                <span className="label-text">Name</span>
               </label>

                 <input
                 type="text"
                 name="name"
                 placeholder="Enter your name"
                 className="input input-bordered w-full"
                 value={formData.name}
                 onChange={handleChange}
                 />
                 </div>

                 <div>
               <label className="label">
                <span className="label-text">surname</span>
               </label>

                 <input
                 type="text"
                 name="surname"
                 placeholder="Enter your surname"
                 className="input input-bordered w-full"
                 value={formData.surname}
                 onChange={handleChange}
                 />
                 </div>
              
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
                Register
                </button>

            </form>

                <p className="text-center mt-4">
                  Already have an account? {" "}
                  <Link 
                  to="/login"
                  className="text-primary font-semibold hover:underline">
                    Login
                  </Link>
                  </p>

          </div>

        </div>

    </div>
  );
};

export default RegisterPage;
