export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-xl text-slate-800">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition">✕</button>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};