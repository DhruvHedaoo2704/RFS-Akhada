import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/public")({
  component: PublicLayout,
});
