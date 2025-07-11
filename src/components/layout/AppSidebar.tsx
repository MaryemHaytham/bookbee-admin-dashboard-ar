
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
    <Sidebar 
      side={language === 'ar' ? 'right' : 'left'}
      className={`border-border ${language === 'ar' ? 'border-l border-r-0' : 'border-r border-l-0'} `}
    >
      <SidebarHeader className="border-b border-border">
        <div className={`p-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <span className="text-2xl font-extrabold">
            <span className="text-orange-500">Book</span>
            <span className="text-black">bee</span>
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors ${
                      language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
                    }`} >
            {t('nav.mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors ${
                      language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="space-y-2">
          <LanguageSwitcher />
          <Button
            variant="outline"
            onClick={logout}
            className={`w-full flex items-center gap-2 ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>{t('nav.logout')}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
