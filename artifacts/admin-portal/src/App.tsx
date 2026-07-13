import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import News from './pages/News';
import Procedures from './pages/Procedures';
import Appointments from './pages/Appointments';
import Queue from './pages/Queue';
import Feedback from './pages/Feedback';
import Citizens from './pages/Citizens';
import EmergencyContacts from './pages/EmergencyContacts';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
        <p className="text-muted-foreground mb-4">Trang không tồn tại hoặc đang được phát triển.</p>
        <a href="/" className="text-primary hover:underline">Quay lại trang chủ</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/staff" component={Staff} />
      <Route path="/departments" component={Departments} />
      <Route path="/roles" component={Roles} />
      <Route path="/news" component={News} />
      <Route path="/procedures" component={Procedures} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/queue" component={Queue} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/citizens" component={Citizens} />
      <Route path="/emergency-contacts" component={EmergencyContacts} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
