import {useState} from "react";
import {ShipWheelIcon} from "lucide-react";
import {Link} from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query"; // ✅ This is the fix
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import {signup,login} from "../lib/api";
const SignUpPage = () =>{
    const[SignupData, setSignupData] = useState({
        fullName:"",
        email:"",
        password:"",
    });
    const navigate = useNavigate();

   const queryClient = useQueryClient();
     /*const{mutate:signupMutation , isPending,error} = useMutation({
        mutationFn: signup,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["authUser"]});
          navigate("/");
        }
       
    })*/

        const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: async (_, variables) => {
        // variables will be SignupData because you pass it into signupMutation(SignupData)
        await login({ email: variables.email, password: variables.password }); // Auto-login after signup
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/");
    }
})

    const handleSignup = (e) =>{
         e.preventDefault(); 
         signupMutation(SignupData);
    }
      
    return(
        <>
         <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">

            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
             {/* SIGNUP FORM - LEFT SIDE */}
             <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
               {/* LOGO */}
               <div className="mb-4 flex items-center justify-start gap-2">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Streamify
                </span>
               </div>
               {/* ERROR MESSAGE IF ANY*/}
   {error && (
    <div className="alert alert-error mb-4">
        <span>{error.response.data.message}</span>
        </div>
   )}
             
               {/* Signup Form*/}
               <div className="w-full">
                <form onSubmit={handleSignup}>
                    <div className="space-y-4">
                       <div>
                         <h2 className="text-xl font-semibold">Create an account</h2>
                         <p className="text-sm opacity-70">
                            Join Streamify and start your language learning adventure! 
                         </p>
                        </div> 
                        <div className="space-y-3">
                            {/* fullName */}
                          <div className="form-control w-full">
                            <label className="label">
                            <span className="label-text">Full Name</span>
                            </label>
                            <input type="text"
                            placeholder="enter full name"
                            className="input input-bordered w-full"
                            value={SignupData.fullName}
                            onChange={(e)=> setSignupData({ ...SignupData, fullName:e.target.value})}
                            required
                            />
                            </div>  
                             {/* Email */}
                            <div className="form-control w-full">
                            <label className="label">
                            <span className="label-text">Email</span>
                            </label>
                            <input type="email"
                            placeholder="enter email"
                            className="input input-bordered w-full"
                            value={SignupData.email}
                            onChange={(e)=> setSignupData({ ...SignupData, email:e.target.value})}
                            required
                            />
                            </div>
                           {/* Password */}
                            <div className="form-control w-full">
                            <label className="label">
                            <span className="label-text">Password</span>
                            </label>
                            <input type="password"
                            placeholder="enter password"
                            className="input input-bordered w-full"
                            value={SignupData.password}
                            onChange={(e)=> setSignupData({ ...SignupData, password:e.target.value})}
                            required
                            />

                            <p className="text-xs opacity-70 mt-1">
                                Password must be at least 6 characters long 
                            </p>
                            </div> 
                            
                               <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                   <input type="checkbox" className="checkbox checkbox-sm" required/>
                                   <span className="text-xs leading-tight">
                                     I agree to the {" "}
                                     <span className="text-primary hover:underline">terms of service</span> and{" "}
                                     <span className="text-primary hover:underline">privacy policy</span>
                                    </span> 
                                </label>
                               </div>
                        </div>

                         <button className="btn btn-primary w-full" type="submit">

                           {isPending ? (
                            <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Loading...
                            </>
                           ):(
                            "Create account"
                           )} 
                         
                         </button>

                         <div className="text-center mt-4">
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                 Sign in 
                                </Link>
                            </p>
                         </div>
                    </div>
                </form>

               </div>
             </div>
             {/*SIGNUP FORM - RIGHT SIDE */}

             <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
              <div className="max-w-md p-8">
                <div className="relative aspect-square max-w-sm mx-auto">
                    <img src="../public/Video call-bro.png" alt="Language connection illustration" className="w-full h-full"/>
                </div>

                <div className="text-center space-y-3 mt-6">

                    <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                    <p className="opacity-70">
                        Practice conversations, make friends and improve your language skills together
                    </p>
                </div>
              </div>
             </div>
            </div>
         </div>
        </>
    )
}

export default SignUpPage;