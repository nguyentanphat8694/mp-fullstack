import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "wedding_dress", label: "Váy cưới" },
  { value: "vest", label: "Vest" },
  { value: "accessories", label: "Phụ kiện" },
  { value: "ao_dai", label: "Áo dài" }
]

const statuses = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "available", label: "Có sẵn" },
  { value: "rented", label: "Đang cho thuê" },
  { value: "maintenance", label: "Đang bảo trì" }
]

const ProductListPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock data
        const mockProducts = [
          {
            id: 1,
            code: "WD001",
            name: "Váy cưới công chúa",
            category: "wedding_dress",
            status: "available",
            description: "Váy cưới phong cách công chúa, màu trắng tinh khôi",
            image: "/images/products/wd001.jpg"
          },
          // ... more mock data
        ]
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  useEffect(() => {
    let result = [...products]
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter)
    }
    
    if (statusFilter !== "all") {
      result = result.filter(product => product.status === statusFilter)
    }
    
    setFilteredProducts(result)
  }, [products, searchTerm, categoryFilter, statusFilter])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // Mock API call
      if (selectedProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, ...data }
            : p
        ))
      } else {
        // Add new product
        setProducts([...products, { id: Date.now(), ...data }])
      }

      setIsOpen(false)
      setSelectedProduct(null)
      toast({
        title: "Thành công",
        description: selectedProduct 
          ? "Đã cập nhật sản phẩm" 
          : "Đã thêm sản phẩm mới"
      })
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu sản phẩm",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsOpen(true)
  }

  const handleDelete = async (productId) => {
    try {
      // Mock API call
      setProducts(products.filter(p => p.id !== productId))
      toast({
        title: "Thành công",
        description: "Đã xóa sản phẩm"
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedProduct(null)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleSubmit} 
              isLoading={isSubmitting} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductTable 
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={(product) => navigate(`/products/${product.id}`)}
        />
      )}
    </div>
  )
}

export default ProductListPage 