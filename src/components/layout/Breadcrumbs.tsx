import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { flatNavItems } from "@/constants/nav";

export function Breadcrumbs() {
  const location = useLocation();
  const activeItem = flatNavItems.find((item) => location.pathname.startsWith(item.path));

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
      <span className="font-medium text-text-secondary">Sentinel Chain</span>
      {activeItem && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-text-primary">{activeItem.label}</span>
        </>
      )}
    </div>
  );
}
