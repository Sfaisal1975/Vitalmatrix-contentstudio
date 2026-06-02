import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getApiKey } from "@/lib/auth";
import { LoginPage } from "@/pages/login";
import { Layout } from "@/components/layout";
import { DashboardPage } from "@/pages/dashboard";
import { SectionPage } from "@/pages/section";
import { FileViewerPage } from "@/pages/file-viewer";
import { BrandGuidePage } from "@/pages/brand-guide";
import { EvidencePage } from "@/pages/evidence";
import { LaunchPage } from "@/pages/launch";
import { MasterSpecPage } from "@/pages/master-spec";
import { NczLaPage } from "@/pages/ncz-la";
import { ComponentsLibraryPage } from "@/pages/components-library";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/sections/:id" component={SectionPage} />
        <Route path="/file" component={FileViewerPage} />
        <Route path="/brand" component={BrandGuidePage} />
        <Route path="/evidence" component={EvidencePage} />
        <Route path="/launch" component={LaunchPage} />
        <Route path="/master-spec" component={MasterSpecPage} />
        <Route path="/ncz-la" component={NczLaPage} />
        <Route path="/components" component={ComponentsLibraryPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [authed, setAuthed] = useState(() => Boolean(getApiKey()));

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
