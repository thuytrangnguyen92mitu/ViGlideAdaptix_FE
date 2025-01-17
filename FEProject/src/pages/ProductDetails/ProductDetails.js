import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();
  const productId = location.state?.productId;

  const [productInfo, setProductInfo] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const productResponse = await axiosInstance.get(`/product/${productId}`);
      if (productResponse.status !== 200) {
        throw new Error("Failed to fetch product details.");
      }
      const productData = productResponse.data;

      setProductInfo(productData);

      // Fetch category name
      const categoryResponse = await axiosInstance.get(
        `/product/category/${productData.categoryId}`
      );
      if (categoryResponse.status === 200) {
        setCategoryName(categoryResponse.data);
      }

      // Fetch brand name
      const brandResponse = await axiosInstance.get(
        `/product/brand/${productData.brandId}`
      );
      if (brandResponse.status === 200) {
        setBrandName(brandResponse.data);
      }

      // The image is already a base64 string, no need for additional fetch
      // If your image is in the productData, use it directly.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(productInfo);

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation="/products" />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <ProductsOnSale />
          </div>

          <div className="h-full xl:col-span-2">
            {productInfo?.productImage ? (
              <img
                className="w-full h-full object-cover"
                src={`data:image/jpeg;base64,${productInfo.productImage}`} // Display Base64 image
                alt={productInfo.productName}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p>No Image Available</p>
              </div>
            )}
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo
              productInfo={productInfo}
              categoryName={categoryName}
              brandName={brandName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
