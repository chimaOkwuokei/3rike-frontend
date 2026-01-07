import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SavingsTargetDashboard() {
    const navigate = useNavigate();
    const handleCreateTarget = () => {
        // Navigate to the new multi-step flow
        navigate('/driver/savings/create-target');
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">

                {/* Header */}
                <div className="relative flex items-center pt-10 p-6">
                    <Button
                        variant="link"
                        onClick={() => navigate(-1)}
                        className="absolute left-6 top-12"
                    >
                        <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                    </Button>
                    <p className="mx-auto font-medium text-lg pt-2">Target Savings</p>
                </div>

                {/* Content */}
                <div className="px-5 space-y-6 flex-1">
                    <div className={`relative w-full h-80 rounded-4xl bg-[#F3F5F9] mb-6`}>
                        <img
                            src="/graybackground.svg"
                            alt="image"
                            className="absolute pt-5 top-0 left-1/2 -translate-x-1/2"
                        />
                    </div>

                    {/* Menu Item */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#F3F5F9] border border-dashed border-[#9747FF] rounded-2xl p-3 flex flex-col gap-3 cursor-pointer hover:bg-[#F0EEFA] transition-colors">

                            {/* Item 1 */}
                            <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="shrink-0">
                                    <img src="/warning-purple.svg" alt="warning-purple" className="w-5 h-5 object-cover" />
                                </div>
                                {/* Text */}
                                <h3 className="text-sm font-medium text-[#9747FF]">Save towards a goal</h3>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="shrink-0">
                                    <img src="/warning-purple.svg" alt="warning-purple" className="w-5 h-5 object-cover" />
                                </div>
                                {/* Text */}
                                <h3 className="text-sm font-medium text-[#9747FF]">Auto Save or Manual save</h3>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-6 pb-10 mt-auto">
                    <Button
                        onClick={handleCreateTarget}
                        className="w-full bg-[#22C55E] hover:bg-[#1da64d] text-white rounded-xl h-12 text-md font-light"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}