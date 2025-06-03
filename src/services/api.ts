
const API_BASE_URL = 'https://mydaqvcbapralulxsotd.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc';

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

interface Product {
  product_id?: string;
  sku: string;
  name: string;
  description: string;
  wholesale_price: number;
  retail_price: number;
  weight: number;
  image_url?: string;
  visible: boolean;
  stock: number;
  reserved: number;
  override_available: boolean;
  available: boolean;
  category_id: string;
  product_owner_id: string;
}

interface Category {
  category_id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface CategorySpec {
  category_spec_id?: string;
  category_id: string;
  name: string;
}

interface ProductOwner {
  product_owner_id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

class ApiService {
  private getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': API_KEY,
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('Attempting login with:', { email });
    const response = await fetch(`${API_BASE_URL}/auth/v1/token`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({
        email,
        password,
        grant_type: 'password'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Login error:', error);
      throw new Error('Login failed: ' + error);
    }

    const data = await response.json();
    console.log('Login successful:', data);
    
    // Store the access token
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async signup(email: string, password: string, fullName: string, phone?: string): Promise<AuthResponse> {
    console.log('Attempting signup with:', { email, fullName, phone });
    const response = await fetch(`${API_BASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName,
          phone: phone || undefined
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Signup error:', error);
      throw new Error('Signup failed: ' + error);
    }

    const data = await response.json();
    console.log('Signup successful:', data);
    return data;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    console.log('Fetching products...');
    const response = await fetch(`${API_BASE_URL}/rest/v1/product`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Get products error:', error);
      throw new Error('Failed to fetch products: ' + error);
    }

    const data = await response.json();
    console.log('Products fetched:', data);
    return data;
  }

  async createOrUpdateProduct(productData: any): Promise<any> {
    console.log('Creating/updating product:', productData);
    const response = await fetch(`${API_BASE_URL}/functions/v1/product-handler`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Create/update product error:', error);
      throw new Error('Failed to create/update product: ' + error);
    }

    const data = await response.json();
    console.log('Product created/updated:', data);
    return data;
  }

  async deleteProduct(productId: string): Promise<void> {
    console.log('Deleting product:', productId);
    const response = await fetch(`${API_BASE_URL}/rest/v1/product?product_id=eq.${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Delete product error:', error);
      throw new Error('Failed to delete product: ' + error);
    }

    console.log('Product deleted successfully');
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    console.log('Fetching categories...');
    const response = await fetch(`${API_BASE_URL}/rest/v1/category`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Get categories error:', error);
      throw new Error('Failed to fetch categories: ' + error);
    }

    const data = await response.json();
    console.log('Categories fetched:', data);
    return data;
  }

  async createCategory(name: string): Promise<Category> {
    console.log('Creating category:', name);
    const response = await fetch(`${API_BASE_URL}/rest/v1/category`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Create category error:', error);
      throw new Error('Failed to create category: ' + error);
    }

    const data = await response.json();
    console.log('Category created:', data);
    return data;
  }

  async updateCategory(oldName: string, newName: string): Promise<void> {
    console.log('Updating category:', oldName, 'to', newName);
    const response = await fetch(`${API_BASE_URL}/rest/v1/category?name=eq.${encodeURIComponent(oldName)}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Update category error:', error);
      throw new Error('Failed to update category: ' + error);
    }

    console.log('Category updated successfully');
  }

  async deleteCategory(name: string): Promise<void> {
    console.log('Deleting category:', name);
    const response = await fetch(`${API_BASE_URL}/rest/v1/category?name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Delete category error:', error);
      throw new Error('Failed to delete category: ' + error);
    }

    console.log('Category deleted successfully');
  }

  // Category Spec methods
  async getCategorySpecs(): Promise<CategorySpec[]> {
    console.log('Fetching category specs...');
    const response = await fetch(`${API_BASE_URL}/rest/v1/category_spec`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Get category specs error:', error);
      throw new Error('Failed to fetch category specs: ' + error);
    }

    const data = await response.json();
    console.log('Category specs fetched:', data);
    return data;
  }

  async createCategorySpec(categoryId: string, name: string): Promise<CategorySpec> {
    console.log('Creating category spec:', { categoryId, name });
    const response = await fetch(`${API_BASE_URL}/rest/v1/category_spec`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        category_id: categoryId,
        name
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Create category spec error:', error);
      throw new Error('Failed to create category spec: ' + error);
    }

    const data = await response.json();
    console.log('Category spec created:', data);
    return data;
  }

  async updateCategorySpec(oldName: string, newName: string): Promise<void> {
    console.log('Updating category spec:', oldName, 'to', newName);
    const response = await fetch(`${API_BASE_URL}/rest/v1/category_spec?name=eq.${encodeURIComponent(oldName)}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Update category spec error:', error);
      throw new Error('Failed to update category spec: ' + error);
    }

    console.log('Category spec updated successfully');
  }

  async deleteCategorySpec(name: string): Promise<void> {
    console.log('Deleting category spec:', name);
    const response = await fetch(`${API_BASE_URL}/rest/v1/category_spec?name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Delete category spec error:', error);
      throw new Error('Failed to delete category spec: ' + error);
    }

    console.log('Category spec deleted successfully');
  }

  // Product Owner methods
  async getProductOwners(): Promise<ProductOwner[]> {
    console.log('Fetching product owners...');
    const response = await fetch(`${API_BASE_URL}/rest/v1/product_owner`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Get product owners error:', error);
      throw new Error('Failed to fetch product owners: ' + error);
    }

    const data = await response.json();
    console.log('Product owners fetched:', data);
    return data;
  }

  async createProductOwner(name: string): Promise<ProductOwner> {
    console.log('Creating product owner:', name);
    const response = await fetch(`${API_BASE_URL}/rest/v1/product_owner`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Create product owner error:', error);
      throw new Error('Failed to create product owner: ' + error);
    }

    const data = await response.json();
    console.log('Product owner created:', data);
    return data;
  }

  async updateProductOwner(oldName: string, newName: string): Promise<void> {
    console.log('Updating product owner:', oldName, 'to', newName);
    const response = await fetch(`${API_BASE_URL}/rest/v1/product_owner?name=eq.${encodeURIComponent(oldName)}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Update product owner error:', error);
      throw new Error('Failed to update product owner: ' + error);
    }

    console.log('Product owner updated successfully');
  }

  async deleteProductOwner(name: string): Promise<void> {
    console.log('Deleting product owner:', name);
    const response = await fetch(`${API_BASE_URL}/rest/v1/product_owner?name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Delete product owner error:', error);
      throw new Error('Failed to delete product owner: ' + error);
    }

    console.log('Product owner deleted successfully');
  }
}

export const apiService = new ApiService();
export type { Product, Category, CategorySpec, ProductOwner };
