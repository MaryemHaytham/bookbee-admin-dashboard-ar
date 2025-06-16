
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { BackButton } from '@/components/common/BackButton';
import { Button } from '@/components/ui/button';
import { Package, FolderTree, Settings, Users, Search, LogOut } from 'lucide-react';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const { t } = useLocalization();

  const menuItems = [
    {
      id: 'products',
      label: t('nav.products'),
      icon: Package,
    },
    {
      id: 'categories',
      label: t('nav.categories'),
      icon: FolderTree,
    },
    {
      id: 'category-specs',
      label: t('nav.categorySpecs'),
      icon: Settings,
    },
    {
      id: 'product-owners',
      label: t('nav.productOwners'),
      icon: Users,
    },
    {
      id: 'smart-search',
      label: t('nav.smartSearch'),
      icon: Search,
    },
  ];

  return (
    <Sidebar side="right" className="border-l border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex flex-col gap-2">
          <BackButton />
          <LanguageSwitcher />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right px-4 py-2 text-sm font-medium text-gray-600">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-end text-right flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{item.label}</span>
                    <item.icon className="h-5 w-5" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full justify-end text-right flex items-center gap-2"
        >
          <span>تسجيل الخروج</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
