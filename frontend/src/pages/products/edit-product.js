import React, {useState} from 'react'
import ProductContent from "../../components/products/product-content"

function EditProduct(props) {

  const [product, setProduct] = useState(null)

  return (
    <div>
      <ProductContent product={product} isEdit/>
    </div>
  );
}

export default EditProduct;
