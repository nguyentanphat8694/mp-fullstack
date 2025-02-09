import {useCallback, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {ImageUpload} from "@/components/ui/image-upload"
import {useToast} from "@/hooks/use-toast"
import useProductCreateMutate from "@/queries/useProductCreateMutate"
import useProductUpdateMutate from "@/queries/useProductUpdateMutate"
import PropTypes from "prop-types"
import {PRODUCT_CATEGORY_OPTIONS} from "@/helpers/constants"
import CustomSelect from "@/components/ui-custom/custom-select/index.jsx";

export const ProductForm = ({product}) => {
  const {toast} = useToast()
  const onSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
    })
  }, [product]);
  const createMutation = useProductCreateMutate(onSuccess);
  const updateMutation = useProductUpdateMutate(product?.id, onSuccess);

  const [formData, setFormData] = useState({
    code: product?.code || "",
    name: product?.name || "",
    category: product?.category || "",
    description: product?.description || "",
    images: product?.images || null
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (product) {
        await updateMutation.mutateAsync(formData)
      } else {
        await createMutation.mutateAsync(formData)
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="code">Mã sản phẩm</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Tên sản phẩm</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Danh mục</Label>
        <CustomSelect
          value={formData.category}
          onValueChange={(value) => setFormData({...formData, category: value})}
          triggerName="Chọn danh mục"
          options={PRODUCT_CATEGORY_OPTIONS}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Hình ảnh</Label>
        <ImageUpload
          value={formData.images}
          onChange={(urls) => setFormData({...formData, images: urls})}
          multiple
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={product ? updateMutation.isPending : createMutation.isPending}>
          {(product ? updateMutation.isPending : createMutation.isPending) ? "Đang xử lý..." : (product ? "Cập nhật" : "Thêm mới")}
        </Button>
      </div>
    </form>
  )
}

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    code: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.array
  }),
  onSubmit: PropTypes.func
} 