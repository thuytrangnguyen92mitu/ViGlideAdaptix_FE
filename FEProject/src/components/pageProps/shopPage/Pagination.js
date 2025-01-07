import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axiosInstance from "../../../utils/axiosInstance";

const Pagination = ({ itemsPerPage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [filters, setFilters] = useState({
    ProductName: "",
    CategoryId: 0,
    BrandId: 0,
    SortBy: null,
    IsDecsending: false,
    PageNumber: 1,
    PageSize: itemsPerPage,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("product", { params: filters });
      const totalRecordsFromAPI = response.data.totalRecords; // Get total records from API
      const totalPages = Math.ceil(totalRecordsFromAPI / itemsPerPage); // Calculate total pages based on total records and items per page

      setTotalRecords(totalRecordsFromAPI);
      setPageCount(totalPages);

      const productData = response.data.data; // Ensure you're accessing the correct property
      const promises = productData.map(async (product) => {
        try {
          const imageResponse = await axiosInstance.get(
            `product/images?imageName=${product.productImage}`
          );

          // The response will contain a data URL with the MIME type
          const imgSrc = imageResponse.data.image;
          return {
            productId: product.productId,
            productImage: imgSrc, // Store the data URL for the image
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
          return { ...product, imgSrc: "" }; // Return product with empty imgSrc on failure
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
  }, [filters]);

  const handlePageClick = (event) => {
    const newPageNumber = event.selected + 1;
    setFilters((prevFilters) => ({
      ...prevFilters,
      PageNumber: newPageNumber,
    }));
    setItemOffset((newPageNumber - 1) * filters.PageSize);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((item) => (
            <div key={item.productId} className="w-full">
              <Product
                _id={item.productId}
                img={item.productImage}
                productName={item.productName}
                price={item.unitPrice}
                des={item.productDescription}
                purchases={item.purchases}
                ratingScore={item.ratingScore}
              />
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />
        <p className="text-base font-normal text-lightText">
          Products from {itemOffset + 1} to{" "}
          {Math.min(itemOffset + filters.PageSize, totalRecords)} of{" "}
          {totalRecords}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
