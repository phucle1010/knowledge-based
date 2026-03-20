export const GlobalLoading = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/30 backdrop-blur-md dark:bg-black/40">
            <div className="relative flex items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-l-purple-500" />

                <div className="absolute h-12 w-12 animate-spin-reverse rounded-full border-4 border-transparent border-t-pink-500 border-r-orange-400 opacity-70" />

                <div className="absolute h-4 w-4 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
            </div>

            <div className="mt-6 flex flex-col items-center gap-1">
                <span className="text-xl font-bold tracking-widest text-gray-800 dark:text-white uppercase">Nexia</span>
                <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-500"></span>
                </div>
            </div>
        </div>
    );
};
