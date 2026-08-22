import { Redirect, Route, Switch, Router as WouterRouter } from "wouter";
import Login from "@/pages/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import Staff from "@/pages/staff";
import StaffCreate from "@/pages/staff/Create";
import StaffDetail from "@/pages/staff/Detail";
import StaffEdit from "@/pages/staff/Edit";
import Departments from "@/pages/department/Departments";
import Divisions from "@/pages/division/Divisions";
import NewsPage from "@/pages/news/NewsPage";
import NewsCreate from "@/pages/news/Create";
import NewsEdit from "@/pages/news/Edit";
import CategoriesPage from "@/pages/categories";
import RoutingPage from "@/pages/routing/RoutingPage";
import Citizens from "@/pages/citizens";
import CitizensCreate from "@/pages/citizens/Create";
import CitizenDetail from "@/pages/citizens/Detail";
import CitizensEdit from "@/pages/citizens/Edit";
import Feedback from "@/pages/Feedback";
import QueueTickets from "@/pages/QueueTickets";
import GeneralSettingsPage from "@/pages/settings/GeneralSettingsPage";
import HotlinePage from "@/pages/settings/hotline/HotlinePage";
import { AuthProvider, QueryClientProviderRoot, useAuth } from "@/shared/providers";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
        <p className="text-muted-foreground mb-4">
          Trang không tồn tại hoặc đang được phát triển.
        </p>
        <a href="/" className="text-primary hover:underline">
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/staff/new">
        <RoleGate adminOnly>
          <StaffCreate />
        </RoleGate>
      </Route>
      <Route path="/staff/:id/edit">
        <RoleGate adminOnly>
          <StaffEdit />
        </RoleGate>
      </Route>
      <Route path="/staff/:id" component={StaffDetail} />
      <Route path="/staff" component={Staff} />
      <Route path="/departments" component={Departments} />
      <Route path="/divisions">
        <Divisions />
      </Route>
      <Route path="/news/new">
        <RoleGate adminOnly>
          <NewsCreate />
        </RoleGate>
      </Route>
      <Route path="/news/:id/edit">
        <RoleGate adminOnly>
          <NewsEdit />
        </RoleGate>
      </Route>
      <Route path="/news">
        <RoleGate adminOnly>
          <NewsPage />
        </RoleGate>
      </Route>
      <Route path="/news/:id">
        <RoleGate adminOnly>
          <NewsPage />
        </RoleGate>
      </Route>
      <Route path="/categories">
        <RoleGate adminOnly>
          <CategoriesPage />
        </RoleGate>
      </Route>
      <Route path="/citizens/new">
        <RoleGate adminOnly>
          <CitizensCreate />
        </RoleGate>
      </Route>
      <Route path="/citizens/:id/edit">
        <RoleGate adminOnly>
          <CitizensEdit />
        </RoleGate>
      </Route>
      <Route path="/citizens/:id">
        <RoleGate adminOnly>
          <CitizenDetail />
        </RoleGate>
      </Route>
      <Route path="/citizens">
        <RoleGate adminOnly>
          <Citizens />
        </RoleGate>
      </Route>
      <Route path="/routing/list">
        <RoleGate adminOnly>
          <Redirect to="/routing" />
        </RoleGate>
      </Route>
      <Route path="/routing/setup">
        <RoleGate adminOnly>
          <Redirect to="/routing" />
        </RoleGate>
      </Route>
      <Route path="/routing">
        <RoleGate adminOnly>
          <RoutingPage />
        </RoleGate>
      </Route>
      <Route path="/feedback" component={Feedback} />
      <Route path="/appointments">
        <RoleGate adminOnly>
          <QueueTickets />
        </RoleGate>
      </Route>
      <Route path="/settings/general">
        <RoleGate adminOnly>
          <GeneralSettingsPage />
        </RoleGate>
      </Route>
      <Route path="/settings/hotline">
        <RoleGate adminOnly>
          <HotlinePage />
        </RoleGate>
      </Route>
      <Route path="/settings">
        <RoleGate adminOnly>
          <Redirect to="/settings/general" />
        </RoleGate>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function RoleGate({
  adminOnly = false,
  children,
}: {
  adminOnly?: boolean;
  children: React.ReactNode;
}) {
  const { isAdminRole } = useAuth();

  if (adminOnly && !isAdminRole) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProviderRoot>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProviderRoot>
  );
}

export default App;
