
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Search } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { SearchResults } from './SearchResults';

interface SearchParam {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SearchOption {
  field: string;
  label: string;
  type: 'string' | 'array';
  operators: { value: string; label: string }[];
}

const searchOptions: SearchOption[] = [
  {
    field: 'select',
    label: 'حقول الاختيار',
    type: 'array',
    operators: [
      { value: '=', label: 'يساوي' }
    ]
  },
  {
    field: 'order',
    label: 'ترتيب',
    type: 'array',
    operators: [
      { value: '=', label: 'يساوي' }
    ]
  },
  {
    field: 'user_id',
    label: 'معرف المستخدم',
    type: 'string',
    operators: [
      { value: 'eq', label: 'يساوي' },
      { value: 'neq', label: 'لا يساوي' }
    ]
  },
  {
    field: 'order_number',
    label: 'رقم الطلب',
    type: 'string',
    operators: [
      { value: 'eq', label: 'يساوي' },
      { value: 'like', label: 'يحتوي على' },
      { value: 'ilike', label: 'يحتوي على (غير حساس للحالة)' }
    ]
  },
  {
    field: 'order_id',
    label: 'معرف الطلب',
    type: 'string',
    operators: [
      { value: 'eq', label: 'يساوي' }
    ]
  },
  {
    field: 'status',
    label: 'حالة الطلب',
    type: 'string',
    operators: [
      { value: 'eq', label: 'يساوي' },
      { value: 'neq', label: 'لا يساوي' }
    ]
  }
];

export const SmartSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParam[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addSearchParam = () => {
    const newParam: SearchParam = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: ''
    };
    setSearchParams([...searchParams, newParam]);
  };

  const removeSearchParam = (id: string) => {
    setSearchParams(searchParams.filter(param => param.id !== id));
  };

  const updateSearchParam = (id: string, field: keyof SearchParam, value: string) => {
    setSearchParams(searchParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const executeSearch = async () => {
    if (searchParams.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة معايير البحث أولاً",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      searchParams.forEach(param => {
        if (param.field && param.operator && param.value) {
          if (param.field === 'select' || param.field === 'order') {
            queryParams.append(param.field, param.value);
          } else {
            queryParams.append(param.field, `${param.operator}.${param.value}`);
          }
        }
      });

      const response = await fetch(`https://mydaqvcbapralulxsotd.supabase.co/rest/v1/orders?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search orders');
      }

      const data = await response.json();
      setSearchResults(data);
      
      toast({
        title: "نجح البحث",
        description: `تم العثور على ${data.length} نتيجة`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOperatorsForField = (field: string) => {
    const option = searchOptions.find(opt => opt.field === field);
    return option?.operators || [];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث الذكي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {searchParams.map((param) => (
            <div key={param.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block text-right">الحقل</label>
                <Select
                  value={param.field}
                  onValueChange={(value) => updateSearchParam(param.id, 'field', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحقل" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchOptions.map((option) => (
                      <SelectItem key={option.field} value={option.field}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block text-right">المشغل</label>
                <Select
                  value={param.operator}
                  onValueChange={(value) => updateSearchParam(param.id, 'operator', value)}
                  disabled={!param.field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشغل" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsForField(param.field).map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block text-right">القيمة</label>
                <Input
                  value={param.value}
                  onChange={(e) => updateSearchParam(param.id, 'value', e.target.value)}
                  placeholder="أدخل القيمة"
                  className="text-right"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSearchParam(param.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={addSearchParam}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة معيار
            </Button>
            <Button onClick={executeSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'جاري البحث...' : 'بحث'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <SearchResults orders={searchResults} />
      )}
    </div>
  );
};
