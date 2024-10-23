import { ReactNode } from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

const DashboardLayout = ({children}:{children: ReactNode}) => {
    return ( 
        <div className="h-full">
            <div className="w-full h-[80px] z-50 fixed md:pl-56 inset-y-0">
                <Navbar /> 
            </div>
            <div className="hidden md:flex flex-col w-56 fixed z-50 inset-y-0">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">
               {children} 
            </main>
            
        </div>
       
     );
}
 
export default DashboardLayout;