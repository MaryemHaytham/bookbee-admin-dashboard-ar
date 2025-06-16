
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Package, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLocalization } from '@/contexts/LocalizationContext';

interface Order {
  order_id: string;
  order_number: string;
  timestamp: string;
  total_amount: number;
  status: string;
  user_id: string;
  user_comments?: string;
  admin_comments?: string;
  user_profiles_user?: {
    full_name: string;
  };
  order_shipment: any[];
  order_payment: any[];
  order_products: any[];
  refunds: any[];
}

interface SearchResultsProps {
  orders: Order[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ orders }) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { t, language } = useLocalization();

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">{t('search.noResults')}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">
          {t('search.results')} ({orders.length} {t('order.number')})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="border rounded-lg">
              {/* Main Order Info */}
              <Collapsible
                open={expandedOrders.has(order.order_id)}
                onOpenChange={() => toggleOrderExpansion(order.order_id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          {expandedOrders.has(order.order_id) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                        <div>
                          <h3 className="font-semibold">{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{formatDate(order.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="font-semibold">
                            {order.total_amount} {t('common.currency')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.user_profiles_user?.full_name || t('search.noResults')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    {/* Order Products */}
                    {order.order_products && order.order_products.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('order.products')} ({order.order_products.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">المنتج</TableHead>
                                <TableHead className="text-right">الفئة</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                                <TableHead className="text-right">السعر</TableHead>
                                <TableHead className="text-right">الإجمالي</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.order_products.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{item.product?.name || 'N/A'}</p>
                                      <p className="text-sm text-gray-600">{item.product?.sku || 'N/A'}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{item.product?.category?.name || 'N/A'}</TableCell>
                                  <TableCell>{item.quantity || 0}</TableCell>
                                  <TableCell>{item.retail_price || 0} {t('common.currency')}</TableCell>
                                  <TableCell>
                                    {((item.quantity || 0) * (item.retail_price || 0)).toFixed(2)} {t('common.currency')}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    )}

                    {/* Order Shipments */}
                    {order.order_shipment && order.order_shipment.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            {t('order.shipments')} ({order.order_shipment.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {order.order_shipment.map((shipment, index) => (
                            <div key={index} className="mb-4 p-3 border rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">رقم الشحنة</label>
                                  <p className="text-sm">{shipment.number || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">الخدمة</label>
                                  <p className="text-sm">{shipment.service || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">شركة الشحن</label>
                                  <p className="text-sm">{shipment.shipping_providers?.name || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                                  <p className="text-sm">{shipment.created_at ? formatDate(shipment.created_at) : 'N/A'}</p>
                                </div>
                              </div>

                              {/* Shipment Products */}
                              {shipment.shipment_products && shipment.shipment_products.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">منتجات الشحنة:</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-right">المنتج</TableHead>
                                        <TableHead className="text-right">الكمية</TableHead>
                                        <TableHead className="text-right">السعر</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {shipment.shipment_products.map((item: any, itemIndex: number) => (
                                        <TableRow key={itemIndex}>
                                          <TableCell>
                                            <div>
                                              <p className="font-medium">{item.product?.name || 'N/A'}</p>
                                              <p className="text-sm text-gray-600">{item.product?.sku || 'N/A'}</p>
                                            </div>
                                          </TableCell>
                                          <TableCell>{item.quantity || 0}</TableCell>
                                          <TableCell>{item.product?.retail_price || 0} {t('common.currency')}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Order Payments */}
                    {order.order_payment && order.order_payment.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t('order.payments')} ({order.order_payment.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">المبلغ</TableHead>
                                <TableHead className="text-right">طريقة الدفع</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-right">التاريخ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.order_payment.map((payment, index) => (
                                <TableRow key={index}>
                                  <TableCell>{payment.amount || 0} {t('common.currency')}</TableCell>
                                  <TableCell>{payment.method || 'N/A'}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(payment.status)}>
                                      {payment.status || 'N/A'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{payment.created_at ? formatDate(payment.created_at) : 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    )}

                    {/* Refunds */}
                    {order.refunds && order.refunds.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <RotateCcw className="h-5 w-5" />
                            {t('order.refunds')} ({order.refunds.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">المبلغ</TableHead>
                                <TableHead className="text-right">السبب</TableHead>
                                <TableHead className="text-right">الحالة</TableHead>
                                <TableHead className="text-right">التاريخ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.refunds.map((refund, index) => (
                                <TableRow key={index}>
                                  <TableCell>{refund.amount || 0} {t('common.currency')}</TableCell>
                                  <TableCell>{refund.reason || 'N/A'}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(refund.status)}>
                                      {refund.status || 'N/A'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{refund.created_at ? formatDate(refund.created_at) : 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
