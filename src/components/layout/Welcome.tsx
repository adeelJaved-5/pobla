
"use client";
import Image from "next/image";

import Logo1 from "@/assets/popup/intro1.png";
import Logo2 from "@/assets/popup/intro2.png";

const Welcome = () => {
    return (
        <div className="fixed inset-0 p-2 flex items-center justify-center bg-black/50 z-50">
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-10 flex flex-col items-center justify-center gap-16 py-24 gradient-bg">
                <Image
                    src={Logo1}
                    alt="logo"
                />
                <Image
                    src={Logo2}
                    alt="logo"
                />
            </div>
        </div>
    );
};

export default Welcome;
