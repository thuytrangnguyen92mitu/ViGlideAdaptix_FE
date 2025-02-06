import { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axiosInstance from "../../../utils/axiosInstance";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);
      const response = await axiosInstance.get("product/bestSeller");
      const productData = response.data;

      const promises = productData.map(async (product) => {
        try {
          const imageResponse = await axiosInstance.get(
            `product/images?imageName=${product.productImage}`
          );
          const imgSrc = imageResponse.data.image;
          return {
            productId: product.productId,
            productImage: imgSrc,
            productName: product.productName,
            unitPrice: product.unitPrice,
            purchases: product.purchases,
            ratingScore: product.ratingScore,
            productDescription: product.productDescription,
          };
        } catch (error) {
          console.error(
            "Error fetching image for product:",
            product.productId,
            error
          );
          return { ...product, imgSrc: "" }; // Return product with empty image on failure
        }
      });

      const mappedProducts = await Promise.all(promises);
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <div key={product.productId} className="px-2">
              <Product
                _id={product.productId}
                img={product.productImage}
                productName={product.productName}
                price={product.unitPrice}
                purchases={product.purchases}
                ratingScore={product.ratingScore}
                cartId={user ? user.cartId : null} // Kiểm tra giá trị user trước khi truy cập cartId
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellers;
