import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      
      {/* SAME BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="floating-orb orb-blue top-20 left-10" />
        <div className="floating-orb orb-gold top-40 right-10" />
        <div className="floating-orb orb-red bottom-10 left-1/3" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        
        {/* TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-white">
            Join the League
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create your Beyblade identity
          </p>
        </div>

        {/* CLERK SIGN UP */}
        <SignUp
          appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",

              formFieldInput:
                "bg-slate-900 border border-white/10 text-white focus:border-sky-400",

              formButtonPrimary:
                "bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-bold hover:opacity-90",

              socialButtonsBlockButton:
                "border border-white/10 bg-white/5 hover:bg-white/10 text-white",

              footerActionLink:
                "text-sky-400 hover:text-sky-300",

              formFieldLabel:
                "text-slate-300",

              dividerText:
                "text-slate-500",
            },
          }}
        />
      </div>
    </main>
  );
}