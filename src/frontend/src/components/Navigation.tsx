import { useNavigate } from '@tanstack/react-router';
import { Building2, FileText, GitCompare, Send, ClipboardList } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const navigate = useNavigate();

  const navItems = [
    { path: '/vendors', label: 'Vendors', icon: Building2 },
    { path: '/purchase-requisitions', label: 'Purchase Requisitions', icon: ClipboardList },
    { path: '/quotation-requests', label: 'Quotation Requests', icon: FileText },
    { path: '/quotation-comparison', label: 'Compare Quotations', icon: GitCompare },
    { path: '/submit-quotation', label: 'Submit Quotation', icon: Send },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
