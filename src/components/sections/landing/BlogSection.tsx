import React from "react";
import { useNavigate } from "react-router-dom";
import { BLOGS } from "../../../data/blog";
import type { blog } from "../../../data/blog";

const BlogSection: React.FC = () => {
  const navigate = useNavigate();
  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    // Remove HTML tags and get plain text
    const plainText = description.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <section id="blogs" className="py-14 sm:py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue/60">
              OUR INSIGHTS
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-5">
            Understanding Trauma <br />
            <span className="text-brand-orange">Through Knowledge</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-brand-blue/70 leading-relaxed">
            Explore our collection of articles that delve deep into trauma, mental health,
            and the path to healing and recovery.
          </p>
        </div>

        {/* ================= BLOGS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {BLOGS.map((blog: blog) => (
            <div
              key={blog.id}
              onClick={() => handleBlogClick(blog.id)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
            >
              {/* Blog Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-blue mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors duration-200">
                  {blog.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {truncateDescription(blog.description)}
                </p>

                {/* Read More Link */}
                <div className="mt-4 flex items-center text-brand-orange font-semibold text-sm group-hover:text-brand-orange/80 transition-colors duration-200">
                  <span>Read More</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= VIEW ALL CTA ================= */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg bg-brand-blue text-white font-semibold text-sm sm:text-base hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;