import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

interface CategorySpec {
  category_spec_id: string;
  name: string;
  category_id: string;
  type: string;
  created_at: string;
}

interface Category {
  category_id: string;
  name: string;
}

export const CategorySpecsTab: React.FC = () => {
  const [categorySpecs, setCategorySpecs] = useState<CategorySpec[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<CategorySpec | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    type: ''
  });
  const { toast } = useToast();
  const { t, language } = useLocalization();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [specsResponse, categoriesResponse] = await Promise.all([
        fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/category_specs?select=*', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
          }
        }),
        fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/categories?select=*', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
          }
        })
      ]);

      if (!specsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to load data');
      }

      const specsData = await specsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setCategorySpecs(specsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: t('common.error'),
        description: t('common.loadError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: t('common.error'),
        description: t('common.nameRequired'),
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        category_id: formData.category_id,
        type: formData.type
      };

      let response;
      if (editingSpec) {
        // Update existing spec
        response = await fetch(`https://mydaqvcbapralulxsotd.supabase.co/rest/v1/category_specs?category_spec_id=eq.${editingSpec.category_spec_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new spec
        response = await fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/category_specs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save category spec');
      }

      const data = await response.json();
      if (editingSpec) {
        toast({
          title: t('common.success'),
          description: t('common.updateSuccess')
        });
      } else {
        toast({
          title: t('common.success'),
          description: t('common.createSuccess')
        });
      }

      loadData();
      setIsDialogOpen(false);
      setFormData({ name: '', category_id: '', type: '' });
      setEditingSpec(null);
    } catch (error) {
      console.error('Error saving category spec:', error);
      toast({
        title: t('common.error'),
        description: editingSpec ? t('common.updateError') : t('common.createError'),
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (spec: CategorySpec) => {
    setEditingSpec(spec);
    setFormData({
      name: spec.name,
      category_id: spec.category_id,
      type: spec.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('common.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`https://mydaqvcbapralulxsotd.supabase.co/rest/v1/category_specs?category_spec_id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category spec');
      }

      toast({
        title: t('common.success'),
        description: t('common.deleteSuccess')
      });
      loadData();
    } catch (error) {
      console.error('Error deleting category spec:', error);
      toast({
        title: t('common.error'),
        description: t('common.deleteError'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t('categorySpecs.title')}
        </h1>
        <p className={`text-muted-foreground mt-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t('categorySpecs.description')}
        </p>
      </div>

      <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSpec(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('categorySpecs.addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                {editingSpec ? t('categorySpecs.edit') : t('categorySpecs.add')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('categorySpecs.name')}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('categorySpecs.enterName')}
                  required
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('categorySpecs.category')}
                </label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('categorySpecs.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('categorySpecs.type')}
                </label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('categorySpecs.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={`flex gap-2 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {editingSpec ? t('common.update') : t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <Settings className="h-5 w-5" />
            {t('categorySpecs.list')} ({categorySpecs.length} {t('categorySpecs.count')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">{t('common.loading')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categorySpecs.name')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categorySpecs.category')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categorySpecs.type')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categorySpecs.createdAt')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categorySpecs.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorySpecs.map((spec) => (
                  <TableRow key={spec.category_spec_id}>
                    <TableCell className="font-medium">{spec.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categories.find(c => c.category_id === spec.category_id)?.name || t('common.notSpecified')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{spec.type}</Badge>
                    </TableCell>
                    <TableCell>{new Date(spec.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(spec)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(spec.category_spec_id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
