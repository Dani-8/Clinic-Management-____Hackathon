import React, { useState, useEffect } from 'react';
import {
    UserPlus, Calendar, BellRing, Activity, FileText,
    Sparkles, ChevronRight, MousePointer2, ShieldCheck
} from 'lucide-react';




const Step = ({ icon: Icon, title, desc, isLast, index, activeStep, progress }) => {
    const isActive = activeStep === index;
    const isPast = activeStep > index;

    return (
        <div
            className={`group flex items-start gap-10 relative pb-16 last:pb-0 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-4' : isPast ? 'opacity-60 translate-x-0' : 'opacity-20 translate-x-0'}`}
        >
            {!isLast && (
                <div className="absolute left-[31px] top-16 w-[2px] h-[calc(100%-40px)] bg-slate-100 overflow-hidden">
                    <div
                        className="w-full bg-gradient-to-b from-blue-600 to-indigo-600"
                        style={{
                            height: isActive ? `${progress}%` : isPast ? '100%' : '0%',
                            transition: 'height 50ms linear'
                        }}
                    />
                </div>
            )}

            <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 z-10 relative border-2 ${isActive
                    ? 'bg-white border-blue-600 shadow-[0_20px_40px_rgba(37,99,235,0.2)] scale-110'
                    : 'bg-white border-slate-100'
                    }`}>
                    <Icon className={`transition-all duration-500 ${isActive ? 'text-blue-600' : 'text-slate-300'}`} size={26} />
                </div>

                {isActive && (
                    <div className="absolute inset-0 rounded-2xl border-3 border-blue-500 animate-ping-slow opacity-40 pointer-events-none"></div>
                )}

                <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center border-2 transition-all duration-500 z-20 ${isActive ? 'bg-blue-600 border-white text-white' : 'bg-slate-50 border-white text-slate-300'
                    }`}>
                    0{index + 1}
                </div>
            </div>

            <div className="pt-2">
                <h3 className={`text-xl font-bold mb-1 tracking-tight transition-all duration-500 ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                    {title}
                </h3>
                <p className={`text-base font-medium leading-relaxed max-w-md transition-all duration-500 ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                    {desc}
                </p>
            </div>
        </div>
    );
};



export default function LandingPage({ onLaunch }) {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const STEP_DURATION = 6000;

    useEffect(() => {
        let start = Date.now();

        const tick = () => {
            const now = Date.now();
            const elapsed = now - start;
            const p = (elapsed / STEP_DURATION) * 100;

            if (p >= 100) {
                start = Date.now();
                setActiveStep((prev) => (prev + 1) % 5);
                setProgress(0);
            } else {
                setProgress(p);
            }
            requestAnimationFrame(tick);
        };

        const anim = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(anim);
    }, []);


    const flow = [
        {
            icon: UserPlus,
            title: "Schedule",
            desc: "Patients choose their preferred specialist and request a consultation slot."
        },
        {
            icon: BellRing,
            title: "Approve",
            desc: "Reception staff verify availability and confirm the booking in one click."
        },
        {
            icon: Calendar,
            title: "Register",
            desc: "The visit is added to the doctor's and patient's calendar."
        },
        {
            icon: Activity,
            title: "Consult",
            desc: "Doctor checks the patient and writes notes or prescriptions."
        },
        {
            icon: FileText,
            title: "Finalize",
            desc: "Patient gets a medical report and can download a PDF."
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-slate-900 overflow-hidden relative">
            {/* Animated background orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-50/50 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            <main className="relative z-10 w-full max-w-6xl px-12 py-20 flex flex-col md:flex-row gap-16 items-center md:items-start">
                <div className="md:sticky md:top-24 w-full md:w-5/12">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-100 animate-float">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.4em]">Core Engine</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8">
                            Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 animate-gradient-x">Care Cycle.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed mb-10">
                            Automating the medical journey with real-time data sync and clinical records.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={onLaunch}
                                className="cursor-pointer group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200 active:scale-95"
                            >
                                Launch App
                                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active System</span>
                            </div>
                        </div>
                    </header>
                </div>


                <div className="w-full md:w-7/12">
                    <div className="max-w-lg mx-auto md:mx-0">
                        {flow.map((step, i) => (
                            <Step key={i} index={i} activeStep={activeStep} progress={progress} {...step} isLast={i === flow.length - 1} />
                        ))}
                    </div>
                </div>
            </main>


            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-ping-slow { animation: ping-slow 2s infinite cubic-bezier(0, 0, 0.2, 1); }
      `}} />
        </div>
    );
}