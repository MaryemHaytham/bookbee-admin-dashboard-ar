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
  const { t, language } = useLocalization();

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
    <div className={`flex min-h-screen`}>
      <Sidebar className={language === 'ar' ? "border-l border-r-0" : "border-r border-l-0"}>
        
          <SidebarHeader>
            <span className="text-2xl font-extrabold">
              <span className="text-orange-500">Book</span>
              <span className="text-black">bee</span>
            </span>
          </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={`px-4 py-2 text-sm font-medium text-gray-600 `}>
              {t('nav.mainMenu')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors `}
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
          <LanguageSwitcher />
          <Button
            variant="outline"
            onClick={logout}
            className={`w-full flex items-center gap-2 `}
          >
            <span>{t('nav.logout')}</span>
            <LogOut className="h-4 w-4" />
            
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">
        {/* Main content */}
      </main>
    </div>
  );
};
