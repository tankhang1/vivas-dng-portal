import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Route, Switch, Router as WouterRouter } from "wouter";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Staff from "./pages/staff";
import StaffCreate from "./pages/staff/Create";
import StaffEdit from "./pages/staff/Edit";
import Departments from "./pages/Departments";
import Roles from "./pages/Roles";
import NewsPage from "./pages/news/NewsPage";
import NewsCreate from "./pages/news/Create";
import NewsEdit from "./pages/news/Edit";
import Events from "./pages/events";
import EventsCreate from "./pages/events/Create";
import EventsEdit from "./pages/events/Edit";
import Routing from "./pages/Routing";
import Citizens from "./pages/citizens";
import CitizensCreate from "./pages/citizens/Create";
import CitizensEdit from "./pages/citizens/Edit";
import Feedback from "./pages/Feedback";
import Appointments from "./pages/Appointments";

const queryClient = new QueryClient();

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
      <Route path="/staff" component={Staff} />
      <Route path="/departments" component={Departments} />
      <Route path="/roles" component={Roles} />
      <Route path="/news/new" component={NewsCreate} />
      <Route path="/news/:id/edit" component={NewsEdit} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsPage} />
      <Route path="/events/new" component={EventsCreate} />
      <Route path="/events/:id/edit" component={EventsEdit} />
      <Route path="/events" component={Events} />
      <Route path="/citizens" component={Citizens} />
      <Route path="/citizens/new" component={CitizensCreate} />
      <Route path="/citizens/:id/edit" component={CitizensEdit} />
      <Route path="/routing" component={Routing} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/appointments" component={Appointments} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
