import {
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx';
import {ALIGN, PRODUCT_CATEGORY_OPTIONS} from '@/helpers/constants.js';
import {
  ProductTableActions,
} from '@/components/products/product-table-actions.jsx';
import PropTypes from 'prop-types';
import {Skeleton} from '@/components/ui/skeleton.jsx';

const TableData = ({data, format, isPending, emptyString}) => {
  return (
      <Table>
        <TableHeader>
          <TableRow>
            {format.map((item, index) => (
                <TableHead
                    className={item.align ? (
                        item.align === ALIGN.LEFT ?
                            'text-left' :
                            item.align === ALIGN.RIGHT ?
                                'text-right' :
                                'text-center'
                    ) : ''}
                    key={`${index}-${item.label}`}>
                  {item.label}
                </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ?
              (<>
                <Skeleton className="h-5 w-full m-auto"/>
                <Skeleton className="h-5 w-full m-auto"/>
                <Skeleton className="h-5 w-full m-auto"/>
              </>) :
              (data?.length > 0 ?
                  (
                      data.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{product.code}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{PRODUCT_CATEGORY_OPTIONS.filter(
                                x => x.value ===
                                    product.category)[0].label}</TableCell>
                            <TableCell className="text-right">
                              <ProductTableActions
                                  product={product}
                                  onEdit={onEdit}
                                  setSelectedProduct={setSelectedProduct}
                                  setShowDeleteDialog={setShowDeleteDialog}
                                  setShowCheckModal={setShowCheckModal}/>
                            </TableCell>
                          </TableRow>
                      ))
                  ) :
                  <TableRow>
                    <TableCell colSpan={3}>{emptyString ??
                        'No Data'}</TableCell>
                  </TableRow>)}
        </TableBody>
      </Table>
  );
};

export default TableData;

TableData.propTypes = {
  data: PropTypes.array,
  isPending: PropTypes.bool,
  format: PropTypes.arrayof(PropTypes.shape({
    className: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    id: PropTypes.string,
    render: PropTypes.func,
  })),
  emptyString: PropTypes.string,
};