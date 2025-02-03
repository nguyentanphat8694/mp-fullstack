const CustomerFilter = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Input
        placeholder="Tìm kiếm khách hàng..."
        value={filterValues.search}
        onChange={(e) =>
          setFilterValues((prev) => ({ ...prev, search: e.target.value }))
        }
        className="col-span-1 sm:col-span-2 lg:col-span-2"
      />
      <Select
        value={filterValues.source}
        onValueChange={(value) =>
          setFilterValues((prev) => ({ ...prev, source: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Nguồn" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả nguồn</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="tiktok">Tiktok</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="walk-in">Vãng lai</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filterValues.status}
        onValueChange={(value) =>
          setFilterValues((prev) => ({ ...prev, status: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="new">Mới</SelectItem>
          <SelectItem value="contacted">Đã liên hệ</SelectItem>
          <SelectItem value="appointment">Có hẹn</SelectItem>
          <SelectItem value="contracted">Đã ký HĐ</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Tìm kiếm
      </Button>
    </div>
  );
};
