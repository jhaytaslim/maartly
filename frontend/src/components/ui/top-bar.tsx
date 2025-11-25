import { memo } from "react";
import { Bell, Search, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TopBarProps {
  language: "en" | "es" | "fr";
  onLogout?: () => void;
  user?: any;
}

export const TopBar = memo(function TopBar({
  language,
  onLogout,
  user,
}: TopBarProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, customers..."
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-2000">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email || "user@maartly.com"}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <div className="px-2 py-1.5 text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});
