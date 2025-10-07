"use client";
import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  X,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { storeApi, uploadApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';
import { Loading } from '@/components/ui/loading';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  settings: unknown;
  owner: {
    walletAddress: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  sales: number;
  revenue: string;
  status: 'active' | 'draft' | 'inactive';
  category: string | null;
  stock: number | 'unlimited';
  images: string[];
  createdAt?: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function ProductsContent() {
  const { isConnected } = useWallet();
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store');

  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Add product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'SOL',
    category: '',
    stock: 'unlimited',
    status: 'active',
    images: [] as string[]
  });

  // Edit product modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'SOL',
    category: '',
    stock: 'unlimited',
    status: 'active',
    images: [] as string[]
  });

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load store data and products
  useEffect(() => {
    const loadData = async () => {
      if (!isConnected || !currentStore) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get store data first
        const store = await storeApi.getStoreBySlug(currentStore);
        setStoreData(store);

        // Get products
        const productsData = await storeApi.getStoreProducts(store.id, {
          page: currentPage,
          limit: 20,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchTerm || undefined,
        });

        setProducts(productsData as ProductsResponse);
      } catch (err) {
        console.error('Error loading products:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isConnected, currentStore, currentPage, statusFilter, categoryFilter, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products?.products) return [];
    const categorySet = new Set(
      products.products
        .map(p => p.category)
        .filter((category): category is string => Boolean(category))
    );
    return Array.from(categorySet);
  }, [products]);

  // Handle image upload
  const handleImageUpload = async (files: FileList, isEdit = false) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const fileArray = Array.from(files);
      const uploadResult = await uploadApi.uploadProductImages(fileArray);

      const imageUrls = uploadResult.files.map(file => file.url);

      if (isEdit) {
        setEditProductData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
      } else {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
      }
    } catch (err) {
      console.error('Error uploading images:', err);
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove image
  const removeImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditProductData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle add product
  const handleAddProduct = async () => {
    if (!storeData || !newProduct.name || !newProduct.price) return;

    try {
      setAddingProduct(true);

      await storeApi.createProduct(storeData.id, {
        name: newProduct.name,
        description: newProduct.description || undefined,
        price: parseFloat(newProduct.price),
        currency: newProduct.currency as 'SOL' | 'USDC',
        category: newProduct.category || undefined,
        stock: newProduct.stock === 'unlimited' ? 'unlimited' : parseInt(newProduct.stock),
        status: newProduct.status as 'active' | 'draft' | 'inactive',
        images: newProduct.images,
      });

      // Reset form and close modal
      setNewProduct({
        name: '',
        description: '',
        price: '',
        currency: 'SOL',
        category: '',
        stock: 'unlimited',
        status: 'active',
        images: []
      });
      setShowAddModal(false);

      // Refresh products
      const productsData = await storeApi.getStoreProducts(storeData.id, {
        page: currentPage,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
      });
      setProducts(productsData as ProductsResponse);
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setAddingProduct(false);
    }
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setEditProductData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      currency: product.currency,
      category: product.category || '',
      stock: product.stock.toString(),
      status: product.status,
      images: product.images || []
    });
    setShowEditModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!storeData || !editProduct || !editProductData.name || !editProductData.price) return;

    try {
      setEditingProduct(true);

      await storeApi.updateProduct(storeData.id, editProduct.id, {
        name: editProductData.name,
        description: editProductData.description || undefined,
        price: parseFloat(editProductData.price),
        currency: editProductData.currency as 'SOL' | 'USDC',
        category: editProductData.category || undefined,
        stock: editProductData.stock === 'unlimited' ? 'unlimited' : parseInt(editProductData.stock),
        status: editProductData.status as 'active' | 'draft' | 'inactive',
        images: editProductData.images,
      });

      // Close modal and reset state
      setShowEditModal(false);
      setEditProduct(null);
      setEditProductData({
        name: '',
        description: '',
        price: '',
        currency: 'SOL',
        category: '',
        stock: 'unlimited',
        status: 'active',
        images: []
      });

      // Refresh products
      const productsData = await storeApi.getStoreProducts(storeData.id, {
        page: currentPage,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
      });
      setProducts(productsData as ProductsResponse);
    } catch (err) {
      console.error('Error updating product:', err);
    } finally {
      setEditingProduct(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!storeData || !confirm('Are you sure you want to delete this product?')) return;

    try {
      await storeApi.deleteProduct(storeData.id, productId);

      // Refresh products
      const productsData = await storeApi.getStoreProducts(storeData.id, {
        page: currentPage,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
      });
      setProducts(productsData as ProductsResponse);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please connect your wallet to manage products.</p>
        </div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-sm font-semibold text-gray-900 mb-2">No Store Selected</h2>
          <p className="text-gray-600">Please select a store to manage products.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentStore={currentStore} />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar currentStore={currentStore} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">
                Manage products for {storeData?.name || currentStore}
              </p>
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">{error}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-400">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-600">Total Products</p>
                <p className="text-sm font-bold text-gray-900">{products?.pagination.total || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-400">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Categories</p>
                <p className="text-sm font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-400">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Active Products</p>
                <p className="text-sm font-bold text-gray-900">
                  {products?.products.filter(p => p.status === 'active').length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-400">
              <Edit className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Draft Products</p>
                <p className="text-sm font-bold text-gray-900">
                  {products?.products.filter(p => p.status === 'draft').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <main className="flex-1 overflow-auto p-6">
          {products && products.products.length > 0 ? (
            <>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {product.images && product.images.length > 0 ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {product.description || 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category || 'Uncategorized'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price} {product.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock === 'unlimited' ? 'Unlimited' : product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sales}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {products.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-xs text-gray-600">
                    Page {currentPage} of {products.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(Math.min(products.pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === products.pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No products found'
                  : 'No products yet'
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start building your product catalog by adding your first product'
                }
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Your First Product
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={newProduct.currency}
                      onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="SOL">SOL</option>
                     
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Digital Art, Tools, Templates"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="text"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="unlimited or number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {newProduct.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={addingProduct || !newProduct.name || !newProduct.price}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingProduct ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editProductData.name}
                    onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editProductData.description}
                    onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProductData.price}
                      onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={editProductData.currency}
                      onChange={(e) => setEditProductData({ ...editProductData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="SOL">SOL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editProductData.category}
                    onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Digital Art, Tools, Templates"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="text"
                      value={editProductData.stock}
                      onChange={(e) => setEditProductData({ ...editProductData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="unlimited or number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editProductData.status}
                      onChange={(e) => setEditProductData({ ...editProductData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files, true)}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {editProductData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {editProductData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index, true)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={editingProduct || !editProductData.name || !editProductData.price}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsContent />
    </Suspense>
  );
}