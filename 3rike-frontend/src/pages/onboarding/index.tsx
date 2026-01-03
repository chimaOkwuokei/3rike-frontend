import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const onboardingData = [
    {
        title: "Apply and own a 3rike",
        description: "Apply to own a 3rike, get approved in under 48 hours, and start earning daily.",
        color: "bg-[#BBE6C3]", // Light green placeholder color from your image
    },
    {
        title: "Savings",
        description: "Save smarter and reach your financial goals with Target Savings and 3rikky Lock Savings.",
        color: "bg-[#7BCD8A]",
    },
    {
        title: "Loans",
        description: "Grow your credit score and get loans up to GHS 16,000 with easy, flexible repayment.",
        color: "bg-[#BBE6C3]",
    },
    {
        title: "Retail Investment",
        description: "Become a 3rike owner with just GHS 600 and start earning weekly.",
        color: "bg-[#7BCD8A]",
    },
];

export default function Onboarding() {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const navigate = useNavigate();
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentScreen(0);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);



    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        // swipe threshold
        if (diff > 50 && currentScreen < onboardingData.length - 1) {
            // swipe left → next
            setCurrentScreen((prev) => prev + 1);
        } else if (diff < -50 && currentScreen > 0) {
            // swipe right → previous
            setCurrentScreen((prev) => prev - 1);
        }

        touchStartX.current = null;
    };

    // --- SPLASH SCREEN ---
    if (currentScreen === -1) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="text-3xl font-bold text-[#01C259]">3rike</div>
            </div>
        );
    }

    const screenData = onboardingData[currentScreen];

    return (
        <div
            className="fixed inset-0 bg-white flex flex-col p-3 overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >

            {/* Image Section */}
            <div
                className={`w-full h-115.5 rounded-4xl ${screenData.color} mb-6`}
            />

            {/* Pagination */}
            <div className="flex justify-center mb-3">
                <div className="flex items-center justify-center w-24 h-4.5 space-x-2 bg-[#01C259] rounded-4xl">
                    {onboardingData.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentScreen
                                ? "bg-gray-200"
                                : "bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col">
                {/* Text */}
                <div className="text-center space-y-3 mb-8 px-2">
                    <h1 className="text-xl md:text-2xl font-extrabold text-black">
                        {screenData.title}
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                        {screenData.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-auto flex flex-col items-center gap-4">
                    <Button
                        onClick={() => navigate("/create-account-rider")}
                        className="w-full py-6 rounded-xl bg-[#01C259] hover:bg-[#019f4a] text-white font-bold text-lg shadow-none"
                    >
                        Create account
                    </Button>

                    <div className="text-sm text-gray-500 font-medium">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-[#01C259] font-bold hover:underline"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
