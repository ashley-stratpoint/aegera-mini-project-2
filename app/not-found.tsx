import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <img 
        src="/images/simula-logo.png" 
        alt="SIMULA Logo" 
        className="w-24 h-24 mb-8 opacity-100" 
      />
      
      <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Masterpiece not found</h2>
      <p className="text-zinc-500 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved to another gallery.
      </p>
      
      <Link href="/blogs">
        <Button className="rounded-full px-8">
          Back to Museum
        </Button>
      </Link>
    </div>
  );
}