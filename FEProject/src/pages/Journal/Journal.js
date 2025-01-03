import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [journalArticles, setJournalArticles] = useState([
    {
      id: 1,
      title: "Phuộc nhún AI: Cách công nghệ thay đổi cảm giác lái ô tô thông minh",
      date: "15/01/2024",
      content: "Phuộc nhún AI là công nghệ tiên tiến giúp xe tự động điều chỉnh độ giảm xóc tùy theo điều kiện đường xá, cải thiện sự thoải mái và an toàn cho người lái...",
    },
    {
      id: 2,
      title: "5 Lợi ích không thể bỏ qua khi sử dụng phuộc nhún AI cho ô tô của bạn",
      date: "10/01/2024",
      content: "Phuộc nhún AI có thể tự động điều chỉnh độ giảm xóc, tiết kiệm nhiên liệu, nâng cao an toàn, cải thiện trải nghiệm lái xe trên mọi địa hình và kéo dài tuổi thọ của phuộc nhún...",
    },
    {
      id: 3,
      title: "Những xu hướng công nghệ ô tô đáng chú ý trong năm 2024: AI và phuộc nhún thông minh",
      date: "05/01/2024",
      content: "Năm 2024 hứa hẹn sẽ chứng kiến sự bùng nổ của công nghệ AI trong ngành ô tô, với phuộc nhún AI là một trong những phát minh quan trọng góp phần thay đổi cách thức lái xe và mang lại trải nghiệm mới...",
    },
  ]);

  useEffect(() => {
    setPrevLocation(location.state?.data || "");
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Journals" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">ViGlide Adaptix</span>{" "}
          is a leading manufacturer of AI-powered suspension technology,
          pioneering the future of digital automotive solutions. 
          Our products are designed to enhance your driving experience, making every journey smoother and more enjoyable.
        </h1>
        <Link to="/shop">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Continue Shopping
          </button>
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
        <div className="journal-articles">
          {journalArticles.map((article) => (
            <div
              key={article.id}
              className="border-b pb-6 mb-6 last:mb-0 hover:bg-gray-50 duration-300"
            >
              <h3 className="text-xl font-semibold text-primeColor">{article.title}</h3>
              <p className="text-sm text-[#767676] mb-4">{article.date}</p>
              <p className="text-base text-[#555555]">{article.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
