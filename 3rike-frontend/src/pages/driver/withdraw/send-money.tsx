import { useState, useEffect } from "react";
import {
    Form,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import { 
    ChevronLeft, 
    X, 
    Check, 
    ChevronRight,
    User,
} from "lucide-react";

// --- Zod Schemas ---
const recipientSchema = z.object({
    accountNumber: z.string().min(10, "Must be 10 digits").max(10),
});

const amountSchema = z.object({
    amount: z.string().min(1, "Enter amount"),
    remark: z.string().optional(),
});

type Step = 'recipient' | 'amount' | 'confirm' | 'pin' | 'success';

export default function WithdrawSendMoney() {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [step, setStep] = useState<Step>('recipient');
    const [recipientData, setRecipientData] = useState<{name: string, bank: string} | null>(null);
    const [transferData, setTransferData] = useState<{amount: string, remark: string} | null>(null);
    
    // Toggle for "Insufficient Funds" simulation
    const [hasFunds, setHasFunds] = useState(true);
    
    // PIN State
    const [pin, setPin] = useState("");

    // --- Forms ---
    const recipientForm = useForm<z.infer<typeof recipientSchema>>({
        resolver: zodResolver(recipientSchema),
        defaultValues: { accountNumber: "" }
    });

    const amountForm = useForm<z.infer<typeof amountSchema>>({
        resolver: zodResolver(amountSchema),
        defaultValues: { amount: "", remark: "" }
    });

    // --- Logic: Step 1 (Recipient) ---
    const watchedAccountNumber = recipientForm.watch("accountNumber");
    
    // Simulate Name Lookup when 10 digits are typed
    useEffect(() => {
        if (watchedAccountNumber?.length === 10) {
            // Mock API lookup delay
            setTimeout(() => {
                setRecipientData({ name: "Ndukwe Anita Nwakaego", bank: "MoMo" });
            }, 500);
        } else {
            setRecipientData(null);
        }
    }, [watchedAccountNumber]);

    const onRecipientSubmit = (_data: z.infer<typeof recipientSchema>) => {
        if (recipientData) setStep('amount');
    };

    // --- Logic: Step 2 (Amount) ---
    const onAmountSubmit = (data: z.infer<typeof amountSchema>) => {
        setTransferData({ amount: data.amount, remark: data.remark || "" });
        setStep('confirm');
    };

    const setPresetAmount = (val: string) => {
        amountForm.setValue("amount", val);
    };

    // --- Logic: Final Submission ---
    const handleFinalSubmit = (finalPin: string) => {
        // 1. Aggregate all data
        const payload = {
            recipientAccount: recipientForm.getValues("accountNumber"),
            recipientName: recipientData?.name,
            recipientBank: recipientData?.bank,
            amount: transferData?.amount,
            remark: transferData?.remark,
            pin: finalPin,
            timestamp: new Date().toISOString()
        };

        // 2. Simulate API Call / Console Log
        console.log("🚀 FINAL FORM SUBMISSION PAYLOAD:", payload);

        // 3. Transition to Success
        setTimeout(() => {
            setStep('success');
        }, 300);
    };

    // --- Logic: Step 4 (PIN Keypad) ---
    const handlePinPress = (num: string) => {
        if (num === "x") {
            setPin(prev => prev.slice(0, -1));
        } else if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            
            // Check if PIN is complete (4 digits)
            if (newPin.length === 4) {
                handleFinalSubmit(newPin);
            }
        }
    };

    // --- Helper to Reset Flow ---
    const resetFlow = () => {
        setStep('recipient');
        setRecipientData(null);
        setTransferData(null);
        setPin("");
        recipientForm.reset();
        amountForm.reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" onClick={() => navigate(-1)} />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl overflow-hidden min-h-150 flex flex-col">
                
                {/* --- DEBUG TOGGLES (Absolute Top Right) --- */}
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button onClick={() => setHasFunds(!hasFunds)} className={`text-[10px] px-2 py-1 rounded border ${hasFunds ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {hasFunds ? "Funds: OK" : "Funds: Low"}
                    </button>
                    <button onClick={resetFlow} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded">Reset</button>
                </div>

                {/* Handle Bar (Visible on most screens except Success/PIN usually) */}
                {step !== 'success' && (
                    <div className="pt-3 pb-2 flex justify-center">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>
                )}


                {/* ============================================================
                    STEP 1: RECIPIENT ACCOUNT
                   ============================================================ */}
                {step === 'recipient' && (
                    <div className="px-6 pt-4 animate-in slide-in-from-right">
                        <h1 className="text-xl font-bold mb-6">Recipient Account</h1>
                        
                        <div className="bg-gray-100/80 rounded-2xl p-4 mb-6">
                            <Form {...recipientForm}>
                                <form onSubmit={recipientForm.handleSubmit(onRecipientSubmit)}>
                                    <FormField
                                        control={recipientForm.control}
                                        name="accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative border-b border-gray-300 pb-1 mb-4">
                                                    <Input 
                                                        placeholder="Enter the 10 digit number" 
                                                        className="border-0 bg-transparent text-lg p-0 placeholder:text-gray-400 focus-visible:ring-0 shadow-none rounded-none"
                                                        maxLength={10}
                                                        type="tel"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    
                                    {/* Bank Selector (Mock) */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            {recipientData?.bank === 'MoMo' && <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold">M</div>}
                                            <span className="text-gray-500 text-sm">{recipientData ? recipientData.bank : "Select Bank"}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                    
                                    {/* Validated Name Badge */}
                                    {recipientData && (
                                        <div className="mt-4 bg-[#D1FADF] rounded-lg p-3 flex items-center gap-2 animate-in fade-in">
                                            <div className="w-5 h-5 bg-[#12B76A] rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-[#027A48] text-sm font-semibold">{recipientData.name}</span>
                                        </div>
                                    )}
                                </form>
                            </Form>
                        </div>

                        <Button 
                            onClick={recipientForm.handleSubmit(onRecipientSubmit)}
                            disabled={!recipientData}
                            className={`w-full py-6 rounded-xl text-lg font-medium transition-colors ${recipientData ? 'bg-[#01C259] hover:bg-[#019f4a]' : 'bg-[#86efac]'}`}
                        >
                            Next
                        </Button>
                    </div>
                )}


                {/* ============================================================
                    STEP 2: AMOUNT & REMARK
                   ============================================================ */}
                {step === 'amount' && (
                    <div className="px-6 pt-2 animate-in slide-in-from-right">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setStep('recipient')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="text-lg font-bold">Transfer to Bank</h2>
                        </div>

                        {/* Recipient Card */}
                        <div className="bg-gray-100/80 rounded-xl p-4 flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{recipientData?.name}</h3>
                                <p className="text-xs text-gray-500">{recipientForm.getValues("accountNumber")}</p>
                            </div>
                        </div>

                        <Form {...amountForm}>
                            <form onSubmit={amountForm.handleSubmit(onAmountSubmit)}>
                                {/* Amount Input */}
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-black ml-1">Amount</label>
                                    <FormField
                                        control={amountForm.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative border-b border-[#01C259] py-2">
                                                    <span className="absolute left-0 text-xl text-gray-400 font-light">₵ |</span>
                                                    <Input 
                                                        className="border-0 bg-transparent text-xl pl-8 p-0 focus-visible:ring-0 shadow-none rounded-none"
                                                        type="number"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    {/* Chips */}
                                    <div className="flex gap-3 mt-4 overflow-x-auto">
                                        {['10', '200', '1000', '2000'].map((amt) => (
                                            <button 
                                                key={amt}
                                                type="button"
                                                onClick={() => setPresetAmount(amt)}
                                                className="px-4 py-2 bg-gray-100 hover:bg-[#E8FBF0] hover:text-[#01C259] rounded-lg text-sm font-medium transition"
                                            >
                                                ₵ {amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Remark Input */}
                                <div className="mb-8">
                                    <label className="text-sm font-bold text-black ml-1">Remark</label>
                                    <FormField
                                        control={amountForm.control}
                                        name="remark"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="border-b border-[#01C259] py-2">
                                                    <Input 
                                                        placeholder="What is the money for" 
                                                        className="border-0 bg-transparent text-sm p-0 placeholder:text-gray-400 focus-visible:ring-0 shadow-none rounded-none"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full py-6 bg-[#01C259] hover:bg-[#019f4a] rounded-xl text-lg font-medium">
                                    Next
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}


                {/* ============================================================
                    STEP 3: CONFIRMATION (With Toggle Logic)
                   ============================================================ */}
                {step === 'confirm' && (
                    <div className="px-6 pt-4 animate-in slide-in-from-bottom duration-300">
                         {/* Close Icon Header */}
                         <div className="flex justify-start mb-4">
                            <button onClick={() => setStep('amount')} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Amount Display */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center text-3xl font-extrabold text-black">
                                <span className="text-gray-400 mr-1 font-light">₵</span>
                                {parseFloat(transferData?.amount || "0").toFixed(2)}
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="space-y-6 text-sm mb-12">
                            <div className="flex justify-between">
                                <span className="text-gray-400 italic">Bank</span>
                                <span className="font-medium">{recipientData?.bank}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 italic">Account Number</span>
                                <span className="font-medium">{recipientForm.getValues("accountNumber")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 italic">Name</span>
                                <span className="font-medium">{recipientData?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 italic">Amount</span>
                                <span className="font-medium">₵ {transferData?.amount}</span>
                            </div>
                            
                            {/* FUNDS CHECK LOGIC */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 italic">Account Balance ₵ 6000</span>
                                {hasFunds ? (
                                    <Check className="w-5 h-5 text-[#01C259]" />
                                ) : (
                                    <span className="text-red-500 text-xs font-medium">Insufficient Funds</span>
                                )}
                            </div>
                        </div>

                        {/* Pay Button */}
                        <Button 
                            onClick={() => hasFunds && setStep('pin')}
                            disabled={!hasFunds} 
                            className={`w-full py-6 rounded-xl text-lg font-medium transition
                                ${hasFunds ? 'bg-[#01C259] hover:bg-[#019f4a]' : 'bg-[#01C259] opacity-50 cursor-not-allowed'}
                            `}
                        >
                            Pay
                        </Button>
                    </div>
                )}


                {/* ============================================================
                    STEP 4: PIN INPUT (Custom Keypad)
                   ============================================================ */}
                {step === 'pin' && (
                    <div className="flex flex-col h-full animate-in slide-in-from-bottom">
                         {/* Close Header */}
                         <div className="px-6 pt-6 mb-10">
                            <button onClick={() => setStep('confirm')} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-6">
                            <h2 className="text-lg font-bold mb-8">Enter your pin</h2>
                            
                            {/* Pin Dots */}
                            <div className="flex gap-4 mb-12">
                                {[0, 1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all
                                            ${pin.length > i ? 'border-gray-400' : 'border-gray-200'}
                                        `}
                                    >
                                        {pin.length > i && <div className="w-3 h-3 bg-gray-600 rounded-full" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Numeric Keypad */}
                        <div className="bg-gray-50 p-4 pb-8 rounded-t-[32px]">
                            <div className="flex justify-between px-4 mb-4 text-[10px] text-gray-500 font-semibold">
                                <span>3rike Secure Numeric Keypad</span>
                                <span className="text-green-500 cursor-pointer" onClick={() => handleFinalSubmit(pin)}>Done</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button 
                                        key={num} 
                                        onClick={() => handlePinPress(num.toString())}
                                        className="h-14 bg-white rounded-lg shadow-sm text-xl font-bold text-black active:bg-gray-100"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => handlePinPress("0")} 
                                    className="h-14 bg-white rounded-lg shadow-sm text-xl font-bold text-black col-start-2 active:bg-gray-100"
                                >
                                    0
                                </button>
                                <button 
                                    onClick={() => handlePinPress("x")} 
                                    className="h-14 bg-white rounded-lg shadow-sm flex items-center justify-center active:bg-gray-100"
                                >
                                    <span className="text-lg font-medium lowercase">x</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ============================================================
                    STEP 5: SUCCESS
                   ============================================================ */}
                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center h-full px-6 pt-20 pb-10 animate-in zoom-in-95 duration-300">
                         {/* Close Header (Hidden usually on success but helpful for flow) */}
                         <div className="absolute top-6 left-6">
                            <button onClick={() => navigate("/driver")} className="text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Success Seal Icon */}
                        <div className="relative mb-6">
                            {/* Green Starburst/Seal shape */}
                            <div className="w-20 h-20 bg-[#01C259] rounded-full flex items-center justify-center">
                                <Check className="w-10 h-10 text-white" strokeWidth={4} />
                            </div>
                        </div>

                        <h2 className="text-[#01C259] font-medium text-lg mb-2">Successful</h2>
                        
                        <div className="flex items-center text-3xl font-extrabold text-black mb-20">
                            <span className="text-gray-400 mr-1 font-light">₵</span>
                            {parseFloat(transferData?.amount || "0").toFixed(2)}
                        </div>

                        <Button 
                            onClick={() => navigate("/driver")}
                            className="w-full py-6 bg-[#01C259] hover:bg-[#019f4a] rounded-xl text-lg font-medium mt-auto"
                        >
                            Done
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}