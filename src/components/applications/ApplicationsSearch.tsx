
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ApplicationsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ApplicationsSearch({ searchQuery, onSearchChange }: ApplicationsSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search applications..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
