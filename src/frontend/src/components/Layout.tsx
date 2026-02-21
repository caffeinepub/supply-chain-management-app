import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import Navigation from './Navigation';
import { Package } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Supply Chain Manager</h1>
                <p className="text-xs text-muted-foreground">Manufacturing & Procurement</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      <Navigation currentPath={currentPath} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Supply Chain Manager. All rights reserved.</p>
            <p>
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'supply-chain-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
