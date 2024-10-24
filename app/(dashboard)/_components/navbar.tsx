import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

const Navbar = () => {
    return ( 
        <div className="p-4 w-full border-b h-full shadow-sm bg-white flex items-center">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
     );
}
 
export default Navbar;