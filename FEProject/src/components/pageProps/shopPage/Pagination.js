import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axiosInstance from "../../../utils/axiosInstance";

const Pagination = ({
  itemsPerPage,
  selectedCategory,
  selectedBrand,
  onItemsPerPageChange,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [cartId, setCartId] = useState("");
  const [loginUser, setLoginUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if customer is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.token) {
      setCartId(user?.cartId);
      setLoginUser(user);
    }
  }, []);

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
      const totalRecordsFromAPI = response.data.totalRecords;
      const totalPages = Math.ceil(totalRecordsFromAPI / itemsPerPage);

      setTotalRecords(totalRecordsFromAPI);
      setPageCount(totalPages);

      const productData = response.data.data;
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
            productDescription: product.productDescription,
          };
        } catch (error) {
          console.error(
            "Error fetching image for product:",
            product.productId,
            error
          );
          return { ...product, imgSrc: "" };
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
    const updatedFilters = {
      ...filters,
      ProductName: searchQuery,
      CategoryId: selectedCategory || 0,
      BrandId: selectedBrand || 0,
      PageSize: itemsPerPage,
    };
    setFilters(updatedFilters);
  }, [searchQuery, selectedCategory, selectedBrand, itemsPerPage]);

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
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-20 py-2 rounded-lg focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={36}>36 per page</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
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
                cartId={cartId}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
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
