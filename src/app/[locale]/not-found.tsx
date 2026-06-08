import { ErrorView } from "@/components/error-view";

export default function NotFound() {
  return <ErrorView code="404" variant="notFound" />;
}
