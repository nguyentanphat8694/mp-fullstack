import { useState, useCallback } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const ImageUpload = ({ 
  value = "", 
  onChange,
  accept = "image/*"
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = Array.from(e.dataTransfer.files)
      .find(file => file.type.startsWith('image/'))
    
    if (file) handleFile(file)
  }, [])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [])

  const handleFile = useCallback((file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const removeImage = useCallback(() => {
    onChange("")
  }, [onChange])

  return (
    <div className="space-y-4">
      {!value ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileInput}
            id="image-upload"
          />
          <label 
            htmlFor="image-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click để tải lên</span>
              {" "}hoặc kéo thả hình ảnh vào đây
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG hoặc GIF
            </div>
          </label>
        </div>
      ) : (
        <div className="relative group aspect-square w-full max-w-[200px]">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 