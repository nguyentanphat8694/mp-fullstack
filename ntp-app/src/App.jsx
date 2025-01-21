import "./App.css";
import {useRoutes, Navigate} from "react-router-dom"
import {PATHS} from "@/helpers/paths"
import {lazy, Suspense} from 'react'
import MainLayout from "@/components/layouts/main-layout"
import {LoadingSpinner} from "@/components/loading-spinner"

// Auth pages
const LoginPage = lazy(() => import('@/views/auth/login'))
const ForgotPasswordPage = lazy(() => import('@/views/auth/forgot-password'))
const ResetPasswordPage = lazy(() => import('@/views/auth/reset-password'))

// Main pages
const DashboardPage = lazy(() => import('@/views/dashboard'))

// Customer pages
const CustomerListPage = lazy(() => import('@/views/customers/list'))
const CustomerDetailPage = lazy(() => import('@/views/customers/detail'))
const AppointmentListPage = lazy(() => import('@/views/appointments/list'))

// Product pages
const ProductListPage = lazy(() => import('@/views/products/list'))
const ProductDetailPage = lazy(() => import('@/views/products/detail'))

const getRoutes = () => {
  const isAuthenticated = true;

  return useRoutes([
    // Auth routes
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

    // Main routes
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

    // Customer routes
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

    // Appointment routes
    {
      path: PATHS.APPOINTMENTS.TODAY,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <AppointmentListPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },

    // Product routes
    {
      path: PATHS.PRODUCTS.LIST,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductListPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },
    {
      path: PATHS.PRODUCTS.DETAIL,
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetailPage />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to={PATHS.AUTH.LOGIN} replace />
      )
    },

    // Fallback route
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
