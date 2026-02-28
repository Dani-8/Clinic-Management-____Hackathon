import { Activity, Loader2 } from 'lucide-react';

export const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfcfd]">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <Activity className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Synchronizing Health Data...</p>
    </div>
);