import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axiosInstance from "../../../utils/axiosInstance";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);
      const response = await axiosInstance.get("product/newArrival");
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

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.productId} className="px-2">
              <Product
                _id={product.productId}
                img={product.productImage}
                productName={product.productName}
                price={product.unitPrice}
                des={product.productDescription}
                purchases={product.purchases}
                ratingScore={product.ratingScore}
                cartId={user ? user.cartId : null} // Kiểm tra giá trị user trước khi truy cập cartId
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default NewArrivals;
