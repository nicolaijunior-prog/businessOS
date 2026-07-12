import { NAV_CONFIG } from "@/lib/nav-config";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-background px-4 py-6">
      <div className="px-3">
        <span className="text-lg font-semibold tracking-tight text-foreground">BusinessOS</span>
      </div>
      <nav className="flex flex-col gap-6">
        {NAV_CONFIG.map((section) => (
          <div key={section.id} className="flex flex-col gap-1">
            <h2 className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {section.label}
            </h2>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <SidebarItem label={item.label} href={item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
