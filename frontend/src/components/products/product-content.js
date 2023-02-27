import React, {useEffect, useState} from 'react';

function ProductContent({ product = null, isEdit = false}) {

  const [name, setName] = useState('')

  useEffect(() => {
    if (product){
      setName(product.name)
    }
  }, [])

  return (
    <div></div>
  );
}

export default ProductContent;
