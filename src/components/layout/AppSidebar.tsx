
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
    <Sidebar 
      side="right" 
      className="border-l-2 border-primary/20 order-1 w-full md:w-auto"
    >
      <SidebarHeader className="p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-primary">BookBee</h2>
            <p className="text-xs md:text-sm text-muted-foreground">لوحة التحكم</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold text-sm md:text-base">
            إدارة النظام
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.url)}
                    isActive={activeTab === item.url}
                    className="w-full justify-start hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-white text-sm md:text-base"
                  >
                    <item.icon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 md:p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
            <User className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
            <div className="text-xs md:text-sm min-w-0">
              <p className="font-medium truncate">{user?.user_metadata?.full_name || 'المستخدم'}</p>
              <p className="text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
          >
            <LogOut className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
