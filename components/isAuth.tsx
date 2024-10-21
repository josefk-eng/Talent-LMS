import { isAuthenticated } from "@/Utils/Auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const isAuth = (Component:any) => {
    return function IsAuth(props:any){
        const auth = isAuthenticated;


        useEffect(() => {
            if (!auth) {
                return redirect("/sign-in");
            }
        }, []);

        if (!auth) {
            return null;
        }

        return <Component {...props} />
    };
}
 
export default isAuth;