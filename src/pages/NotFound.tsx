
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Link>
      </Button>
    </div>
  );
}
