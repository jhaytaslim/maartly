import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  CreditCard,
  Users,
  UserCircle,
  Store,
  FileText,
  Settings,
  Wifi,
  WifiOff,
  Calculator,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./sidebar";
import { Badge } from "./badge";
import { useState, useMemo } from "react";
import { UserRole, canAccessPage } from "../../lib/permissions";
import { PageType } from "@/App";
import { useAuth } from "@/lib/auth-context";

interface AppSidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  userRole: UserRole;
}

interface MenuItem {
  title: string;
  icon: any;
  page: PageType;
  badge?: number | null;
  roles?: UserRole[];
}

export function AppSidebar({
  currentPage,
  setCurrentPage,
  userRole,
}: AppSidebarProps) {
  const [isOffline, setIsOffline] = useState(false);
  const { logout } = useAuth();

  const allMenuItems = useMemo(
    () => ({
      main: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          page: "dashboard" as PageType,
          badge: null,
        },
        {
          title: "Point of Sale",
          icon: ShoppingCart,
          page: "pos" as PageType,
          badge: null,
        },
      ],
      inventory: [
        {
          title: "Products",
          icon: Package,
          page: "products" as PageType,
          badge: null,
        },
        {
          title: "Categories",
          icon: FolderTree,
          page: "categories" as PageType,
          badge: null,
        },
        {
          title: "Suppliers",
          icon: Truck,
          page: "suppliers" as PageType,
          badge: null,
        },
        {
          title: "Product Transfer",
          icon: ArrowRightLeft,
          page: "product-transfer" as PageType,
          badge: null,
        },
        {
          title: "Low Stock Alerts",
          icon: AlertTriangle,
          page: "low-stock-alerts" as PageType,
          badge: 12,
        },
      ],
      sales: [
        {
          title: "Orders",
          icon: Receipt,
          page: "orders" as PageType,
          badge: null,
        },
        {
          title: "Tax Management",
          icon: Calculator,
          page: "tax-management" as PageType,
          badge: null,
        },
      ],
      admin: [
        {
          title: "Pricing Plans",
          icon: CreditCard,
          page: "pricing-plans" as PageType,
          badge: null,
        },
        {
          title: "Employees",
          icon: Users,
          page: "employees" as PageType,
          badge: null,
        },
        {
          title: "Customers",
          icon: UserCircle,
          page: "customers" as PageType,
          badge: null,
        },
        {
          title: "Stores",
          icon: Store,
          page: "stores" as PageType,
          badge: null,
        },
        {
          title: "Debt Management",
          icon: FileText,
          page: "debt-management" as PageType,
          badge: null,
        },
      ],
      settings: [
        {
          title: "Settings",
          icon: Settings,
          page: "settings" as PageType,
          badge: null,
        },
      ],
    }),
    []
  );

  const filterMenuItems = (items: MenuItem[]) => {
    return items.filter((item) => canAccessPage(userRole, item.page));
  };

  const visibleMenuItems = useMemo(
    () => ({
      main: filterMenuItems(allMenuItems.main),
      inventory: filterMenuItems(allMenuItems.inventory),
      sales: filterMenuItems(allMenuItems.sales),
      admin: filterMenuItems(allMenuItems.admin),
      settings: filterMenuItems(allMenuItems.settings),
    }),
    [allMenuItems, userRole]
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Maartly</span>
            <span className="text-xs text-muted-foreground">
              Smart Inventory. Smarter Business.
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        {visibleMenuItems.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.main.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {visibleMenuItems.inventory.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.inventory.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {visibleMenuItems.sales.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Sales</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.sales.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {visibleMenuItems.admin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.admin.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {visibleMenuItems.settings.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.settings.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            {isOffline ? (
              <>
                <WifiOff className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">Online</span>
              </>
            )}
          </span>
          <Badge variant="outline" className="text-xs">
            {userRole.replace("_", " ")}
          </Badge>
        </div>
      </SidebarFooter> */}

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            {isOffline ? (
              <>
                <WifiOff className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">Online</span>
              </>
            )}
          </span>
          <Badge variant="outline" className="text-xs">
            {userRole.replace("_", " ")}
          </Badge>
        </div>

        <div className="mt-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
