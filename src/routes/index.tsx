import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CompleteView } from "@/components/complete-view";
import { SessionView } from "@/components/session-view";
import { SetupView } from "@/components/setup-view";
import { useTabata } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const view = useTabata((s) => s.view);
  const hydrate = useTabata((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (view === "session") return <SessionView />;
  if (view === "complete") return <CompleteView />;
  return <SetupView />;
}
