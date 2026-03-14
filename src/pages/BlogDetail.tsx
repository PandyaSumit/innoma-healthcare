import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BLOGS } from "../data/blog";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const blog = BLOGS.find((blog) => blog.id === id);

    if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-6">The blog you are looking for does not exist.</p>
            <button
              onClick={() => navigate("/")}
                className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition-colors"
            >
                Back to Home
            </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-16 ">
          <div className="max-w-4xl">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center cursor-pointer gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </button>

            <h1 className="text-xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-white/80">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
                Mental Health
              </span>
              <span className="text-sm">Trauma & Healing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-12 py-16">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Blog Content */}
          <div className="p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none text-gray-700  
             [&_ul]:list-disc [&_ul]:ml-5 [&_li]:my-2 [&_h6]:my-5 [&_h6]:text-brand-blue [&_h6]:font-bold [&_h6]:lg md:[&_h6]:text-2xl
             [&_li::marker]:text-black
             [&_a]:text-brand-blue [&_a]:hover:text-brand-blue/80 [&_a]:transition-colors [&_mark]:bg-transparent [&_mark]:text-black [&_mark]:px-1 [&_mark]:rounded
             "
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </div>
        </div>

        {/* Related Blogs Section */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-8 text-center">
            Related Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOGS.filter((b) => b.id !== blog.id)
              .slice(0, 3)
              .map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-brand-blue mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors duration-200">
                      {relatedBlog.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {relatedBlog.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 120)}
                      ...
                    </p>

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
        </div>

        {/* Call to Action */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-brand-blue to-brand-orange rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Need Professional Help?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Our team of trauma-informed therapists is here to support you on
            your healing journey. Book a consultation today and take the first
            step towards recovery.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-white text-brand-blue rounded-lg font-bold hover:bg-white/90 transition-colors shadow-lg"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
