import { SignIn } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">Sign In</Button>
      </DialogTrigger>
      
      <DialogContent className="p-0 border-none bg-transparent max-w-[400px] shadow-none flex flex-col items-center">
        <DialogClose className="absolute -top-10 right-0 md:-right-10 text-white/70 hover:text-white transition-colors outline-none">
          <X className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-zinc-200 dark:border-zinc-800",
              headerSubtitle: "text-zinc-500",
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}