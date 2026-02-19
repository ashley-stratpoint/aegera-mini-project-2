export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
        
        <div className="absolute">
          <img 
            src="/images/simula-logo.png" 
            alt="Loading SIMULA..." 
            className="w-12 h-12 object-contain opacity-80"
          />
        </div>
      </div>
    </div>
  );
}