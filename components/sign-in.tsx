import { SignIn } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent max-w-[400px]">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border border-zinc-200"
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}