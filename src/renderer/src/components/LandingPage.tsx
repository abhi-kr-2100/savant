import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import Header from "@/components/Header";

function LandingPage() {
  const [goal, setGoal] = useState("");
  const canSubmit = goal.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    // TODO: hand the goal to the lesson-builder flow.
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="surface-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      <Header />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-10">
        <div className="w-full max-w-2xl text-center">
          <h1 className="font-heading text-5xl font-light leading-none tracking-tight sm:text-6xl">
            <span className="text-gold-gradient">Savant</span>
          </h1>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-muted-foreground sm:text-base">
            Learn anything. Then retain it for life.
          </p>

          <form className="mt-12 sm:mt-14" onSubmit={handleSubmit}>
            <div className="group rounded-2xl border border-border/80 bg-card/60 px-5 py-4 backdrop-blur-md transition-all duration-300 focus-within:border-gold-soft/40 focus-within:shadow-gold sm:px-6 sm:py-5">
              <div className="flex items-center gap-4">
                <input
                  autoFocus
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="What do you want to learn?"
                  aria-label="What do you want to learn?"
                  className="min-w-0 flex-1 bg-transparent font-heading text-xl font-light tracking-wide outline-none placeholder:text-muted-foreground/50 sm:text-2xl"
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  aria-label="Begin"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold text-black transition-all duration-300 hover:brightness-110 active:scale-95 disabled:bg-secondary disabled:text-muted-foreground disabled:hover:brightness-100"
                >
                  <ArrowRight className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
