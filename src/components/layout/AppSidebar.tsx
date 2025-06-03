
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
} from "@/components/ui/sidebar";
import { 
  Package, 
  Tag, 
  Settings, 
  Users, 
  BookOpen,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "المنتجات",
    url: "products",
    icon: Package,
  },
  {
    title: "الفئات",
    url: "categories",
    icon: Tag,
  },
  {
    title: "مواصفات الفئات",
    url: "category-specs",
    icon: Settings,
  },
  {
    title: "مالكو المنتجات",
    url: "product-owners",
    icon: Users,
  },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r-2 border-primary/20">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">BookBee</h2>
            <p className="text-sm text-muted-foreground">لوحة التحكم</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            إدارة النظام
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.url)}
                    isActive={activeTab === item.url}
                    className="w-full justify-start hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-white"
                  >
                    <item.icon className="ml-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
            <User className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="font-medium">{user?.user_metadata?.full_name || 'المستخدم'}</p>
              <p className="text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
