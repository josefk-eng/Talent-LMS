import Image from "next/image";

const Logo = () => {
    return ( 
        <Image
            width={130}
            height={130}
            alt="logo"
            src='/edifylogo.png' />
     );
}
 
export default Logo;