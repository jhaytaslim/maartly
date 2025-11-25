import { useState, lazy, Suspense, memo, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { TopBar } from "@/components/ui/top-bar";
import { LandingPage } from "@/pages/landing-page";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { canAccessPage } from "@/lib/permissions";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Page, PageType } from "./constants";

// Define the pages to exclude from the main accessible list
const excludedPages: PageType[] = [
  Page.VerifyAccount,
  Page.CustomerStorefront,
] as const;

// Define a type for the component loader functions
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;
// Map of page keys to their lazy-loaded component
const PageComponents: Record<PageType, LazyComponent> = {
  [Page.Dashboard]: lazy(() =>
    import("@/pages/dashboard-overview").then((m) => ({
      default: m.DashboardOverview,
    }))
  ),
  [Page.POS]: lazy(() =>
    import("@/pages/pos-page").then((m) => ({
      default: m.POSPage,
    }))
  ),
  [Page.Products]: lazy(() =>
    import("@/pages/products-page").then((m) => ({
      default: m.ProductsPage,
    }))
  ),
  [Page.Categories]: lazy(() =>
    import("@/pages/categories-page").then((m) => ({
      default: m.CategoriesPage,
    }))
  ),
  [Page.Suppliers]: lazy(() =>
    import("@/pages/suppliers-page").then((m) => ({
      default: m.SuppliersPage,
    }))
  ),
  [Page.ProductTransfer]: lazy(() =>
    import("@/pages/product-transfer-page").then((m) => ({
      default: m.ProductTransferPage,
    }))
  ),
  [Page.LowStockAlerts]: lazy(() =>
    import("@/pages/low-stock-alerts-page").then((m) => ({
      default: m.LowStockAlertsPage,
    }))
  ),
  [Page.Orders]: lazy(() =>
    import("@/pages/orders-page").then((m) => ({
      default: m.OrdersPage,
    }))
  ),
  [Page.TaxManagement]: lazy(() =>
    import("@/pages/tax-management-page").then((m) => ({
      default: m.TaxManagementPage,
    }))
  ),
  [Page.PricingPlans]: lazy(() =>
    import("@/pages/pricing-plans-page").then((m) => ({
      default: m.PricingPlansPage,
    }))
  ),
  [Page.Employees]: lazy(() =>
    import("@/pages/employees-page").then((m) => ({
      default: m.EmployeesPage,
    }))
  ),
  [Page.Customers]: lazy(() =>
    import("@/pages/customers-page").then((m) => ({
      default: m.CustomersPage,
    }))
  ),
  [Page.Stores]: lazy(() =>
    import("@/pages/stores-page").then((m) => ({
      default: m.StoresPage,
    }))
  ),
  [Page.DebtManagement]: lazy(() =>
    import("@/pages/debt-management-page").then((m) => ({
      default: m.DebtManagementPage,
    }))
  ),
  [Page.Settings]: lazy(() =>
    import("@/pages/settings-page").then((m) => ({
      default: m.SettingsPage,
    }))
  ),
  [Page.VerifyAccount]: lazy(() =>
    import("@/pages/verify-account-page").then((m) => ({
      default: m.VerifyAccountPage,
    }))
  ),
  // [Page.VerifyAccount]: lazy(() =>
  // import("./components/pages/verify-account-page").then((m) => ({
  //   default: m.default,
  // }))),
  [Page.CustomerStorefront]: lazy(() =>
    import("@/pages/customer-storefront-page").then((m) => ({
      default: m.CustomerStorefrontPage,
    }))
  ),
};

// --- Loading Fallback Component ---

const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// interface PageRendererProps {
//   currentPage: PageType;
//   language: "en" | "es" | "fr";
//   setLanguage: (lang: "en" | "es" | "fr") => void;
// }

interface MainLayoutProps {
  language: "en" | "es" | "fr";
  setLanguage: (lang: "en" | "es" | "fr") => void;
  logout: () => void;
  user: any;
}

function MainLayout({ language, setLanguage, logout, user }: MainLayoutProps) {
  const { pageName } = useParams<{ pageName: PageType }>();
  const navigate = useNavigate();

  const currentPage: PageType =
    pageName && PageComponents[pageName] ? pageName : Page.Dashboard;

  const hasAccess = canAccessPage(user.role, currentPage);

  if (!hasAccess) {
    const accessiblePages: PageType[] = (
      Object.values(Page) as PageType[]
    ).filter((page) => !excludedPages.includes(page as PageType));

    const firstAccessible = accessiblePages.find((page) =>
      canAccessPage(user.role, page)
    );

    // If restricted, redirect to the first accessible page
    if (firstAccessible) {
      // Use Navigate component for declarative redirection
      console.log("Access Denied. Redirecting to:", firstAccessible);
      return <Navigate to={`/${firstAccessible}`} replace />;
    }
    // Fallback for case where user has no access to ANY page (Highly restrictive role)
    return (
      <div className="p-8 text-center text-xl text-red-600">
        Access Denied. Please contact your administrator.
      </div>
    );
  }

  // --- Page Rendering (O(1) Lookup Logic) ---

  const Component = PageComponents[currentPage];

  const CurrentPageRenderer =
    // Handle conditional props for SettingsPage
    currentPage === Page.Settings ? (
      <Component language={language} setLanguage={setLanguage} />
    ) : (
      <Component />
    );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar
          currentPage={currentPage}
          // Use React Router navigate to update the URL on click
          setCurrentPage={(page: PageType) => navigate(`/${page}`)}
          userRole={user.role}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar language={language} onLogout={logout} user={user} />
          <main
            className={`flex-1 overflow-auto ${
              currentPage === Page.POS
                ? "bg-gray-50/50 p-4"
                : "bg-gray-50/50 p-6"
            }`}
          >
            <Suspense fallback={<LoadingFallback />}>
              {CurrentPageRenderer}
            </Suspense>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

// --- Full Screen Wrapper Component (For special routes without layout) ---

interface FullScreenWrapperProps {
  page: PageType;
}

function FullScreenWrapper({ page }: FullScreenWrapperProps) {
  const Component = PageComponents[page];

  if (!Component) {
    // Should not happen for a hardcoded route, but good for safety
    return <Navigate to={`/${Page.Dashboard}`} replace />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
      <Toaster />
    </Suspense>
  );
}

// --- App Content Component (Handles Auth and Routing) ---

function VerifyAccountHandler() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, logout, navigate]);

  // While redirecting or for unauthenticated users, render the page
  if (!isAuthenticated) {
    return <FullScreenWrapper page={Page.VerifyAccount} />;
  }

  // Optional: temporary placeholder while redirecting
  return null;
}

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [language, setLanguage] = useState<"en" | "es" | "fr">("en");

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      {/* --- Public route: Customer Storefront --- */}
      <Route
        path={`/${Page.CustomerStorefront}`}
        element={<FullScreenWrapper page={Page.CustomerStorefront} />}
      />

      <Route
        path={`/${Page.VerifyAccount}`}
        element={<VerifyAccountHandler />}
      />

      {/* --- Unauthenticated users --- */}
      {!isAuthenticated || !user ? (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* --- Authenticated users --- */
        <>
          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={`/${Page.Dashboard}`} replace />}
          />

          {/* Main layout for all protected pages */}
          <Route
            path="/:pageName"
            element={
              <MainLayout
                language={language}
                setLanguage={setLanguage}
                logout={logout}
                user={user}
              />
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to={`/${Page.Dashboard}`} replace />}
          />
        </>
      )}
    </Routes>
  );
}

// --- Final Application Export ---

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
