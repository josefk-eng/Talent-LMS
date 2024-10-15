'use client'
import React from "react";
import Image from "next/image"

const AuthLayout = ({children}:{children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen">
        <div className="bg-slate-500 flex-1 hidden lg:block">
            <Image
            src="/images/edifylgwhite.png"
            width={200}
            height={100}
            alt="Edify Logo" 
            className="p-5"/>
            <div className="lg:grid place-items-center">
                <Image
                    src="/images/triawhite.png"
                    alt="Concept"
                    width={800}
                    height={500}
                    className="p-10"
                />
                <p className="text-xl font-extrabold text-white ">Improve & Expand</p>
                <p className="text-sm text-center px-14 py-2 font-bold text-slate-200">Edify works with education entrepreneurs who operate Christ-centered schools. Alongside local partners, we offer them access to the tools they need the most: training, loan capital, and education technology. This helps improve the quality of education, expand their schools, and build longevity for their communities.</p>
            </div>
        </div>
        <div className="bg-slate-50 flex-1 grid place-items-center p-5">
            <div className="tab-section bg-gray-100 rounded-lg p-5 min-w-full">
                {children}
            </div>
        </div>
        <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
    )
}
 
export default AuthLayout;