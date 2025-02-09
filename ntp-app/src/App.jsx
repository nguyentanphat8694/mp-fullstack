import './App.css';
import {useRoutes, Navigate} from 'react-router-dom';
import {PATHS} from '@/helpers/paths';
import {lazy, Suspense, useEffect} from 'react';
import MainLayout from '@/components/layouts/main-layout';
import {LoadingSpinner} from '@/components/loading-spinner';
import useUserInfoStore from '@/stores/useUserInfoStore';
import {useNavigate} from 'react-router-dom';

// Auth pages
const LoginPage = lazy(() => import('@/views/auth/login'));
const ForgotPasswordPage = lazy(() => import('@/views/auth/forgot-password'));
const ResetPasswordPage = lazy(() => import('@/views/auth/reset-password'));

// Main pages
const DashboardPage = lazy(() => import('@/views/dashboard'));

// Customer pages
const CustomerListPage = lazy(() => import('@/views/customers/list'));
const CustomerDetailPage = lazy(() => import('@/views/customers/detail'));
const AppointmentListPage = lazy(() => import('@/views/appointments/list'));

// Product pages
const ProductListPage = lazy(() => import('@/views/products/list'));
const ProductDetailPage = lazy(() => import('@/views/products/detail'));

// Employee pages
const EmployeeListPage = lazy(() => import('@/views/employees/list'));
const EmployeeDetailPage = lazy(() => import('@/views/employees/detail'));

// Task pages
const TaskListPage = lazy(() => import('@/views/tasks/list'));

// Contract pages
const ContractListPage = lazy(() => import('@/views/contracts/list'));
const ContractDetailPage = lazy(() => import('@/views/contracts/detail'));
const CreateContractPage = lazy(() => import('@/views/contracts/create'));

// Finance pages
const FinanceListPage = lazy(() => import('@/views/finance/list'));

function App() {
  const navigate = useNavigate();

  // Get userInfo from zustand store
  const userInfo = useUserInfoStore((state) => state.userInfo);

  // Check if user is authenticated based on userInfo existence
  // const isAuthenticated = userInfo
  const isAuthenticated = true;

  const getRoutes = () => {
    return useRoutes([
      // Auth routes
      {
        path: PATHS.AUTH.LOGIN,
        element: getUnauthenticatedEl(isAuthenticated, <LoginPage/>),
      },
      {
        path: PATHS.AUTH.FORGOT_PASSWORD,
        element: getUnauthenticatedEl(isAuthenticated, <ForgotPasswordPage/>),
      },
      {
        path: PATHS.AUTH.RESET_PASSWORD,
        element: getUnauthenticatedEl(isAuthenticated, <ResetPasswordPage/>),
      },

      // Main routes
      {
        path: PATHS.DASHBOARD,
        element: getAuthenticatedEl(isAuthenticated, <DashboardPage/>),
      },

      // Customer routes
      {
        path: PATHS.CUSTOMERS.LIST,
        element: getAuthenticatedEl(isAuthenticated, <CustomerListPage/>),
      },
      {
        path: PATHS.CUSTOMERS.DETAIL,
        element: getAuthenticatedEl(isAuthenticated, <CustomerDetailPage/>),
      },

      // Appointment routes
      {
        path: PATHS.APPOINTMENTS.TODAY,
        element: getAuthenticatedEl(isAuthenticated, <AppointmentListPage/>),
      },

      // Product routes
      {
        path: PATHS.PRODUCTS.LIST,
        element: getAuthenticatedEl(isAuthenticated, <ProductListPage/>),
      },
      {
        path: PATHS.PRODUCTS.DETAIL,
        element: getAuthenticatedEl(isAuthenticated, <ProductDetailPage/>),
      },

      // Employee routes
      {
        path: PATHS.EMPLOYEES.LIST,
        element: getAuthenticatedEl(isAuthenticated, <EmployeeListPage/>),
      },
      {
        path: PATHS.EMPLOYEES.DETAIL,
        element: getAuthenticatedEl(isAuthenticated, <EmployeeDetailPage/>),
      },

      // Task routes
      {
        path: PATHS.TASKS.LIST,
        element: getAuthenticatedEl(isAuthenticated, <TaskListPage/>),
      },

      // Contract routes
      {
        path: PATHS.CONTRACTS.LIST,
        element: getAuthenticatedEl(isAuthenticated, <ContractListPage/>),
      },
      {
        path: PATHS.CONTRACTS.NEW,
        element: getAuthenticatedEl(isAuthenticated, <CreateContractPage/>),
      },
      {
        path: PATHS.CONTRACTS.DETAIL,
        element: getAuthenticatedEl(isAuthenticated, <ContractDetailPage/>),
      },
      {
        path: PATHS.CONTRACTS.EDIT,
        element: getAuthenticatedEl(isAuthenticated, <CreateContractPage/>),
      },

      // Finance routes
      {
        path: PATHS.FINANCE.LIST,
        element: getAuthenticatedEl(isAuthenticated, <FinanceListPage />),
      },

      // Fallback route
      {
        path: '*',
        element: (
            <Navigate
                to={isAuthenticated ? PATHS.DASHBOARD : PATHS.AUTH.LOGIN}
                replace
            />
        ),
      },
    ]);
  };

  useEffect(() => {
    if (userInfo) {
      navigate(PATHS.DASHBOARD);
    }
  }, [userInfo]);

  useEffect(() => {
    // Tính toán chiều rộng của scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Thêm padding-right cho body bằng với chiều rộng scrollbar
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }, []);

  return getRoutes();
}

const getAuthenticatedEl = (isAuthenticated, pageNode) => {
  return isAuthenticated ? (
      <MainLayout>
        <Suspense fallback={<LoadingSpinner/>}>
          {pageNode}
        </Suspense>
      </MainLayout>
  ) : (
      <Navigate to={PATHS.AUTH.LOGIN} replace/>
  );
};

const getUnauthenticatedEl = (isAuthenticated, pageNode) => {
  return !isAuthenticated ? (
      <Suspense fallback={<LoadingSpinner/>}>
        {pageNode}
      </Suspense>
  ) : (
      <Navigate to={PATHS.DASHBOARD} replace/>
  );
};

export default App;
