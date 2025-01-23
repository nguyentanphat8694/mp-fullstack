import { useState, useEffect } from "react"
import { Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export const ProductSelection = ({ value = [], onChange }) => {
  const [selectedProducts, setSelectedProducts] = useState(value)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Call API to get available products
        const response = await fetch('/api/products?status=available')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const handleAddProduct = (product) => {
    const newProduct = {
      product_id: product.id,
      product: product,
      rental_start: null,
      rental_end: null
    }
    setSelectedProducts([...selectedProducts, newProduct])
    onChange([...selectedProducts, newProduct])
    setShowProductDialog(false)
  }

  const handleRemoveProduct = (productId) => {
    const updated = selectedProducts.filter(p => p.product_id !== productId)
    setSelectedProducts(updated)
    onChange(updated)
  }

  const handleDateChange = (productId, field, date) => {
    const updated = selectedProducts.map(p => {
      if (p.product_id === productId) {
        return { ...p, [field]: date }
      }
      return p
    })
    setSelectedProducts(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chọn sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SP</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge variant="success">Có sẵn</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleAddProduct(product)}
                      >
                        Chọn
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProducts.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedProducts.map((item) => (
              <TableRow key={item.product_id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.product.code}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <DatePicker
                    value={item.rental_start}
                    onChange={(date) => handleDateChange(item.product_id, 'rental_start', date)}
                  />
                </TableCell>
                <TableCell>
                  <DatePicker
                    value={item.rental_end}
                    onChange={(date) => handleDateChange(item.product_id, 'rental_end', date)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(item.product_id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
} 