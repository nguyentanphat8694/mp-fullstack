import {useCallback, useState} from "react"
import {Shirt, Plus, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useNavigate} from "react-router-dom"
import {ProductTable} from "@/components/products/product-table"
import {ProductForm} from "@/components/products/product-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {useToast} from "@/hooks/use-toast"
import {CustomPageTitle} from "@/components/ui-custom/custom-page-title"
import useProductListQuery from "@/queries/useProductListQuery"
import CustomSelect from "@/components/ui-custom/custom-select";
import {PRODUCT_CATEGORY_OPTIONS} from "@/helpers/constants";

// const mockProducts = [
//   {
//     id: 1,
//     code: '123',
//     name: 'Váy cưới nhẹ nhàng',
//     category: 'wedding_dress',
//   }
// ]

const ProductListPage = () => {
  const navigate = useNavigate()
  const {toast} = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [filterValues, setFilterValues] = useState({
    search: "",
    category: "all"
  })
  
  // Query params state
  const [filterParams, setFilterParams] = useState({
    search: "",
    category: "",
    limit: itemsPerPage,
    offset: 0
  })

  const {data, isPending} = useProductListQuery(filterParams)

  const handleSearch = useCallback(() => {
    setCurrentPage(1)
    const newParams = {
      ...filterParams,
      search: filterValues.search,
      category: filterValues.category !== 'all' ? filterValues.category : '',
      offset: 0
    }
    setFilterParams(newParams)
  }, [filterValues])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setFilterParams(prev => ({
      ...prev,
      offset: (page - 1) * itemsPerPage
    }))
  }, [itemsPerPage])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // TODO: Implement API call for create/update
      toast({
        title: "Thành công",
        description: selectedProduct
          ? "Đã cập nhật sản phẩm"
          : "Đã thêm sản phẩm mới"
      })
      setIsOpen(false)
      setSelectedProduct(null)
      // Refresh product list
      handleSearch()
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

  return (
    <div className="space-y-6">
      <CustomPageTitle title={'Danh sách sản phẩm'} icon={<Shirt className="h-6 w-6 text-primary"/>}/>
      
      <div className="flex justify-end items-center">
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedProduct(null)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4"/>
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
              // onSubmit={handleSubmit}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
          value={filterValues.search}
          onChange={(e) => setFilterValues(prev => ({...prev, search: e.target.value}))}
          className="md:col-span-2"
        />
        <CustomSelect
          value={filterValues.category}
          onValueChange={(value) => setFilterValues(prev => ({...prev, category: value}))}
          triggerName="Lọc theo danh mục"
          options={PRODUCT_CATEGORY_OPTIONS}
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4"/>
          Tìm kiếm
        </Button>
      </div>

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ProductTable
          products={data?.data?.data?.data ?? []}
          onEdit={handleEdit}
          onViewDetail={(product) => navigate(`/products/${product.id}`)}
          currentPage={currentPage}
          totalPages={Math.ceil((data?.data?.total ?? 0) / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}

      {/*<ProductTable*/}
      {/*    products={mockProducts}*/}
      {/*    onEdit={handleEdit}*/}
      {/*    onViewDetail={(product) => navigate(`/products/${product.id}`)}*/}
      {/*    currentPage={currentPage}*/}
      {/*    totalPages={Math.ceil((data?.data?.total ?? 0) / itemsPerPage)}*/}
      {/*    onPageChange={handlePageChange}*/}
      {/*  />*/}
    </div>
  )
}

export default ProductListPage 