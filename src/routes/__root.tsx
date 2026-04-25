import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { RouteLoadingOverlay } from "@/components/app/route-loading-overlay";
import { IntroSplash } from "@/components/app/intro-splash";
import { SignOutOverlay } from "@/components/app/sign-out-overlay";
import { AuthProvider } from "@/lib/account";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diploo — A modern website builder for insurance agents" },
      {
        name: "description",
        content:
          "A clean, modern platform for insurance agents to launch beautiful lead-generation websites in minutes — Medicare, ACA, Life, Health, Auto, Home, and more.",
      },
      { name: "author", content: "Diploo" },
      { property: "og:title", content: "Diploo — A modern website builder for insurance agents" },
      {
        property: "og:description",
        content:
          "Build modern lead-generation websites in minutes. Designed for every kind of insurance agent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/diploofly-icon.png",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?" +
          [
            "family=Inter:wght@400;500;600;700",
            "family=Inter+Tight:wght@500;600;700",
            "family=Instrument+Sans:wght@500;600;700",
            "family=Instrument+Serif",
            "family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700",
            "family=Playfair+Display:wght@500;600;700",
            "family=Plus+Jakarta+Sans:wght@500;600;700",
            "family=Source+Serif+4:wght@500;600;700",
            "family=Source+Sans+3:wght@400;500;600",
            "family=IBM+Plex+Sans:wght@400;500;600;700",
            "family=Bricolage+Grotesque:wght@500;600;700",
            "family=DM+Serif+Display",
            "family=DM+Sans:wght@400;500;600;700",
            "family=Cormorant+Garamond:wght@500;600;700",
            "display=swap",
          ].join("&"),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { pathname } = useLocation();

  // Always scroll to top on route change so a new tab doesn't appear identical
  // to the previous one when the user was scrolled down the page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <AuthProvider>
      <Outlet />
      <RouteLoadingOverlay />
      <IntroSplash />
      <SignOutOverlay />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
