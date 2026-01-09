import { useState } from "react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import {
    Landmark,
    Lock,
    AlertCircle,
    XCircle,
} from "lucide-react";

// --- Zod Schema ---
const formSchema = z.object({
    bankName: z.string().min(1, "Please select a bank"),
    accountName: z.string().min(2, "Name must be at least 2 characters"),
    accountNumber: z
        .string()
        .regex(/^\d+$/, "Account number must be digits only")
        .min(10, "Account number must be at least 10 digits"),
});

export default function WithdrawBankDetails() {
    const navigate = useNavigate();

    // State to manage views: 'form' or 'summary' (the linked state)
    const [view, setView] = useState<'form' | 'summary'>('form');

    // Status State for Form feedback: 'idle' | 'error'
    // (Success now transitions to 'summary' view)
    const [formError, setFormError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock Data to display in Summary View (would come from form/API normally)
    const [linkedData, setLinkedData] = useState({
        bankName: "MoMo PSB",
        accountNumber: "029108390",
        accountName: "Effiong Musa"
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountName: "",
            accountNumber: "",
        },
    });

    // Mock Submission
    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        setFormError(false);

        // Simulate API delay
        setTimeout(() => {
            console.log("Submitting:", data);
            setLoading(false);

            // Save data for the summary view
            setLinkedData({
                bankName: data.bankName === 'opay' ? 'OPay' : 'MoMo PSB', // Just for demo
                accountNumber: data.accountNumber,
                accountName: data.accountName
            });

            // Transition to the Third Page (Summary)
            setView('summary');
        }, 1500);
    }

    // -- Debug/Dev Toggles --
    // const triggerSuccess = () => {
    //     setLinkedData({ bankName: "MoMo PSB", accountNumber: "029108390", accountName: "Effiong Musa" });
    //     setView('summary');
    // };

    // const triggerError = () => {
    //     setView('form');
    //     setFormError(true);
    // };

    const handleSendToAccount = () => {
        navigate('/driver/withdraw/send-money')
    };
    const reset = () => {
        setView('form');
        setFormError(false);
        form.reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => navigate(-1)}
            />

            {/* Modal Sheet */}
            <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">

                {/* Handle Bar */}
                <div className="pt-4 flex justify-center">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* --- Debug Buttons (Top Right) --- */}
                {/* <div className="absolute top-6 right-4 flex gap-2 z-10">
                    <Button variant="link" onClick={triggerSuccess} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">View Linked</Button>
                    <Button variant="link" onClick={triggerError} className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded">Toggle Fail</Button>
                    <Button variant="link" onClick={reset} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded">Reset</Button>
                </div> */}

                <div className="p-6 pb-12">

                    {/* ==============================================
                        VIEW 1: FORM INPUT (Default)
                       ============================================== */}
                    {view === 'form' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">

                            {/* Error Banner */}
                            {formError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-red-800 text-sm">Linking Failed</h3>
                                        <p className="text-xs text-red-600">Please check details and try again.</p>
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-4">
                                    <Landmark className="w-10 h-10 text-[#A855F7]" />
                                </div>
                                <h1 className="text-2xl font-bold text-black mb-2">Bank details</h1>
                                <p className="text-gray-400 text-sm max-w-70 leading-tight">
                                    Link bank account. Your financial data is encrypted and never shared.
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                    {/* Bank Name */}
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-500 font-normal">Bank Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <div className="relative">
                                                        <SelectTrigger className="w-full h-14 rounded-xl border-gray-400 text-gray-900 text-base px-4">
                                                            <SelectValue placeholder="Select your bank" />
                                                        </SelectTrigger>
                                                    </div>
                                                    <SelectContent>
                                                        <SelectItem value="access">Access Bank</SelectItem>
                                                        <SelectItem value="gtb">GTBank</SelectItem>
                                                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                                                        <SelectItem value="opay">OPay</SelectItem>
                                                        <SelectItem value="momo">MoMo PSB</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Account Name */}
                                    <FormField
                                        control={form.control}
                                        name="accountName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Account holder name"
                                                        className="h-14 rounded-xl border-gray-400 text-base px-4 placeholder:text-gray-400"
                                                        {...field}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Account Number */}
                                    <FormField
                                        control={form.control}
                                        name="accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Account number"
                                                        type="tel"
                                                        maxLength={10}
                                                        className="h-14 rounded-xl border-gray-400 text-base px-4 placeholder:text-gray-400"
                                                        {...field}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Disclaimer */}
                                    <div className="bg-[#FFF7ED] border border-dashed border-[#FDBA74] rounded-xl p-4 flex items-start gap-3 mt-4">
                                        <AlertCircle className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                                        <p className="text-xs text-[#EA580C] leading-snug">
                                            By linking your bank account you agree to 3rike terms of service.
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <Button variant="link"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 bg-[#01C259] hover:bg-[#019f4a] text-white text-lg font-medium rounded-xl mt-4"
                                    >
                                        {loading ? "Linking..." : "Link Account"}
                                    </Button>

                                    {/* Footer Security */}
                                    <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <Lock className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-xs">Secured by 3rike financial service</span>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    )}

                    {/* ==============================================
                        VIEW 2: SUMMARY / LINKED (Third Page)
                       ============================================== */}
                    {view === 'summary' && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300 pt-4">

                            {/* Header Icon */}
                            <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-4">
                                <Landmark className="w-10 h-10 text-[#A855F7]" />
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-black mb-1">Bank details</h1>

                            {/* Green Action Link */}
                            <Button variant="link"
                                onClick={reset} // Example action: go back to edit
                                className="text-[#01C259] text-sm font-light underline mb-8 hover:text-green-700"
                            >
                                Manage Bank Accounts
                            </Button>

                            {/* Linked Account Card */}
                            <div className="w-full relative bg-[#F3F5F9] border-2 border-dashed border-[#D8B4FE] rounded-2xl p-4 flex items-center justify-between mb-2">

                                {/* Logo Area */}
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                                    {/* Placeholder Logo Icon */}
                                    <img src="/momo.svg" className="w-40 h-40 " />
                                </div>

                                {/* Details Area */}
                                <div className="text-right flex flex-col justify-center">
                                    <p className="text-[#9747FF] font-light text-xs leading-none tracking-wide">
                                        {linkedData.accountNumber}
                                    </p>
                                    <p className="text-[#909090] text-xs font-light mt-1">
                                        {linkedData.bankName}
                                    </p>
                                    <p className="text-[#9747FF] text-xs font-light">
                                        {linkedData.accountName}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Link */}
                            <div className="w-full flex justify-end">
                                <Button onClick = {handleSendToAccount} variant="link" className="text-gray-400 text-xs underline hover:text-gray-600 transition-colors">
                                    Send to Another Account
                                </Button>
                            </div>

                            {/* Extra spacer to match modal height feel */}
                            <div className="h-10" />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}