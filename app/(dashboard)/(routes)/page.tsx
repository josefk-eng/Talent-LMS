'use client'
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(()=>{
    const session = sessionStorage.getItem('id');
    console.log(`This is the session stored ${session}`);
    if(!session){
      router.push('/sign-in');
    }
  });

  return (
    <div>
      {/* <UserButton afterSignOutUrl="/sign-in" /> */}
    </div>
  );
}
