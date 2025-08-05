import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api.js";
import { CameraIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {LANGUAGES} from "../constants/index.js";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { ShipWheelIcon,LoaderIcon } from "lucide-react";
import { useEffect } from "react";
const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
    }
  }, [authUser]);
  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError:(error)=>{
     toast.error(error.response.data.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

 /*const handleRandomAvatar = () => {
  const seed = Math.floor(Math.random() * 1000000);
  //const avatarUrl = `https://api.dicebear.com/7.x/thumbs/png?seed=${seed}`;
  //const avatarUrl = `https://api.dicebear.com/7.x/thumbs/png?seed=${seed}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&bold=true`;
  setFormState({ ...formState, profilePic: avatarUrl });
  toast.success("Random profile picture generated!");
};*/

const handleRandomAvatar = () => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formState.fullName || "User")}&background=random&rounded=true&bold=true`;
  setFormState({ ...formState, profilePic: avatarUrl });
  toast.success("Random profile picture generated!");
};



  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar Button */}
              <div className="flex items-center  gap-2">
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-outline btn-accent"
              >
                🎲 Generate Random Avatar
              </button>
              </div>
           </div>

           {/* Full Name */}
           <div className="form-control">
            <label className="label">
                <span className="label-text">Full Name</span>
            </label>
            <input
            type="text"
            name="fullName"
            value={formState.fullName}
            onChange={(e)=> setFormState({ ...formState , fullName:e.target.value})}
            className = "input input-bordered w-full"
            placeholder="full name"
            />
           
           </div>

           {/* BIO */}

            <div className="form-control">
            <label className="label">
                <span className="label-text">Bio</span>
            </label>
            <input
            type="text"
            name="bio"
            value={formState.bio}
            onChange={(e)=> setFormState({ ...formState , bio:e.target.value})}
            className = "textarea textarea-bordered h-24"
            placeholder="Tell others about yourself and your language learning goals"
            />
           
           </div>

           {/*Language*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/*NATIVE LANGUAGE */ }
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Native Language</span>
                </label>
            <select
            name="nativeLanguage"
            value={formState.nativeLanguage}
            onChange={(e)=> setFormState({ ...formState, nativeLanguage:e.target.value})}
            className="select select-bordered w-full"
            >
                <option value="">Select your native language</option>
                {LANGUAGES.map(lang => (
                <option key={`native-${lang}`} value={lang.toLowerCase()}>
               {lang}
               </option>
       ))}
 
            </select>
            </div>

           {/*LEARNING LANGUAGE */} 
            
             <div className="form-control">
                <label className="label">
                    <span className="label-text">Learning Language</span>
                </label>
            <select
            name="learningLanguage"
            value={formState.learningLanguage}
            onChange={(e)=> setFormState({ ...formState, learningLanguage:e.target.value})}
            className="select select-bordered w-full"
            >
                <option value="">Select your learning language</option>
                {LANGUAGES.map(lang => (
                <option key={`native-${lang}`} value={lang.toLowerCase()}>
               {lang}
               </option>
       ))}
 
            </select>
            </div>

        </div> 

        {/* LOCATION*/}   

        <div className="form-control">
            <label className="label">
            <span className="label-text">Locarion</span>
            </label>
            <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 *:text-base-content opacity-70"/>
                <input 
                type="text"
                name="location"
                value={formState.location}
                onChange={(e)=> setFormState({ ...formState, location:e.target.value})}
                className="input input-bordered w-full pl-10"
                placeholder="City,Country"
                />
            </div>
            
        </div>

        {/* SUBMIT BUTTOn*/ }

        <button className="btn btn-primary w-full" disabled={isPending} type="submit">
            {isPending ? (
              <>
               
               <LoaderIcon className="animate-spin size-5 mr-2"/>
              Onboarding... 
              </>  
            ):(
                <>
              <ShipWheelIcon className="size-5 mr-2"/>
               Complete Onboarding  
              </>
            )}

        </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
