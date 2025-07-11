import React, { useState, useEffect } from 'react';
import { apiService, type ProductOwner } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

export const ProductOwnersTab: React.FC = () => {
  const { t, language } = useLocalization();
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<ProductOwner | null>(null);
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    loadProductOwners();
  }, []);

  const loadProductOwners = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProductOwners();
      setProductOwners(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('productOwners.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerName.trim()) {
      toast({
        title: t('common.error'),
        description: t('productOwners.fillRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingOwner) {
        await apiService.updateProductOwner(editingOwner.name, ownerName);
        toast({
          title: t('common.success'),
          description: t('productOwners.updateSuccess'),
        });
      } else {
        await apiService.createProductOwner(ownerName);
        toast({
          title: t('common.success'),
          description: t('productOwners.addSuccess'),
        });
      }

      setIsDialogOpen(false);
      setOwnerName('');
      setEditingOwner(null);
      loadProductOwners();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('productOwners.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (ownerName: string) => {
    if (!confirm(t('productOwners.deleteConfirm'))) return;

    try {
      await apiService.deleteProductOwner(ownerName);
      toast({
        title: t('common.success'),
        description: t('productOwners.deleteSuccess'),
      });
      loadProductOwners();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('productOwners.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (owner: ProductOwner) => {
    setEditingOwner(owner);
    setOwnerName(owner.name);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOwner(null);
    setOwnerName('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t('productOwners.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('productOwners.title')}</h2>
          <p className="text-muted-foreground">{t('productOwners.pageDescription')}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('productOwners.addNew')}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingOwner ? t('productOwners.edit') : t('productOwners.addNew')}
                </DialogTitle>
                <DialogDescription>
                  {t('productOwners.fillRequired')}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">{t('productOwners.name')}</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder={t('productOwners.name')}
                    required
                    className={language === 'ar' ? 'text-right' : ''}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingOwner ? t('common.update') : t('common.add')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('productOwners.list')}</CardTitle>
          <CardDescription>
            {t('productOwners.count')}: {productOwners.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('productOwners.name')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('common.description')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productOwners.map((owner) => (
                <TableRow key={owner.product_owner_id}>
                  <TableCell className={language === 'ar' ? 'text-right font-medium' : 'font-medium'}>{owner.name}</TableCell>
                  <TableCell className={language === 'ar' ? 'text-right' : ''}>
                    {owner.created_at ? new Date(owner.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US') : t('products.notSpecified')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(owner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(owner.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
