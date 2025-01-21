import "./App.css";
import {useRoutes, Navigate} from "react-router-dom"
import {PATHS} from "@/helpers/paths"
import {lazy, Suspense} from 'react'
import MainLayout from "@/components/layouts/main-layout"
import {LoadingSpinner} from "@/components/loading-spinner"

const LoginPage = lazy(() => import('@/views/auth/login'));
const ForgotPasswordPage = lazy(() => import('@/views/auth/forgot-password'));
const ResetPasswordPage = lazy(() => import('@/views/auth/reset-password'));

const DashboardPage = lazy(() => import('@/views/dashboard'));
const CustomerListPage = lazy(() => import('@/views/customers/list'))
const CustomerDetailPage = lazy(() => import('@/views/customers/detail'))

const getRoutes = () => {
  const isAuthenticated = true;

  return useRoutes([
    {
      path: PATHS.AUTH.LOGIN,
      element: !isAuthenticated ? (
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      ) : (
        <Navigate to={PATHS.DASHBOARD} replace />
      )
    },
    {
      path: PATHS.AUTH.FORGOT_PASSWORD,
      element: !isAuthenticated ? (
        <Suspense fallback={<LoadingSpinner />}>
          <ForgotPasswordPage />
        </Suspense>
      ) : (
        <Navigate to={PATHS.DASHBOARD} replace />
      )
    },
    {
      path: PATHS.AUTH.RESET_PASSWORD,
      element: !isAuthenticated ? (
        <Suspense fallback={<LoadingSpinner />}>
          <ResetPasswordPage />
        </Suspense>
      ) : (
        <Navigate to={PATHS.DASHBOARD} replace />
      )
    },
    {
      path: PATHS.DASHBOARD,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },
    {
      path: PATHS.CUSTOMERS.LIST,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <CustomerListPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },
    {
      path: PATHS.CUSTOMERS.DETAIL,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <CustomerDetailPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },
    {
      path: "*",
      element: (
        <Navigate
          to={isAuthenticated ? PATHS.DASHBOARD : PATHS.AUTH.LOGIN}
          replace
        />
      )
    }
  ]);
};

function App() {
  return getRoutes();
}

export default App;
