import { useQuery } from "@tanstack/react-query";

import {getAuthUser} from "../lib/api";

const useAuthUser = () =>{
    const {isLoading , data , error} = useQuery({
        queryKey:["authUser"],
        queryFn: getAuthUser,
        retry: false,
    });

    return { isLoading , authUser:data?.user,error};
};

export default useAuthUser;