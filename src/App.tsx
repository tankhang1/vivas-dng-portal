import { Redirect, Route, Switch, Router as WouterRouter } from "wouter";
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Staff from '@/pages/staff';
import StaffCreate from '@/pages/staff/Create';
import StaffDetail from '@/pages/staff/Detail';
import StaffEdit from '@/pages/staff/Edit';
import Departments from '@/pages/Departments';
import Divisions from '@/pages/Divisions';
import NewsPage from '@/pages/news/NewsPage';
import NewsCreate from '@/pages/news/Create';
import NewsEdit from '@/pages/news/Edit';
import CategoriesPage from '@/pages/categories';
import CategoriesCreate from '@/pages/categories/Create';
import CategoriesEdit from '@/pages/categories/Edit';
import Routing from '@/pages/Routing';
import Citizens from '@/pages/citizens';
import CitizensCreate from '@/pages/citizens/Create';
import CitizenDetail from '@/pages/citizens/Detail';
import CitizensEdit from '@/pages/citizens/Edit';
import Feedback from '@/pages/Feedback';
import Appointments from '@/pages/Appointments';
import { AuthProvider, QueryClientProviderRoot } from '@/shared/providers';

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
      <Route path="/categories/new" component={CategoriesCreate} />
      <Route path="/categories/:id/edit" component={CategoriesEdit} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/citizens/new" component={CitizensCreate} />
      <Route path="/citizens/:id/edit" component={CitizensEdit} />
      <Route path="/citizens/:id" component={CitizenDetail} />
      <Route path="/citizens" component={Citizens} />
      <Route path="/routing" component={Routing} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/appointments" component={Appointments} />
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
