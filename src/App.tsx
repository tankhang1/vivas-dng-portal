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
import { AuthProvider, QueryClientProviderRoot } from "@/shared/providers";

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
      <Route path="/staff/new" component={StaffCreate} />
      <Route path="/staff/:id/edit" component={StaffEdit} />
      <Route path="/staff/:id" component={StaffDetail} />
      <Route path="/staff" component={Staff} />
      <Route path="/departments" component={Departments} />
      <Route path="/divisions" component={Divisions} />
      <Route path="/news/new" component={NewsCreate} />
      <Route path="/news/:id/edit" component={NewsEdit} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/citizens/new" component={CitizensCreate} />
      <Route path="/citizens/:id/edit" component={CitizensEdit} />
      <Route path="/citizens/:id" component={CitizenDetail} />
      <Route path="/citizens" component={Citizens} />
      <Route path="/routing/list">
        <Redirect to="/routing" />
      </Route>
      <Route path="/routing/setup">
        <Redirect to="/routing" />
      </Route>
      <Route path="/routing" component={RoutingPage} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/appointments" component={QueueTickets} />
      <Route path="/settings/general" component={GeneralSettingsPage} />
      <Route path="/settings/hotline" component={HotlinePage} />
      <Route path="/settings">
        <Redirect to="/settings/general" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
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
