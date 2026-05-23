import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Newspaper, ChevronLeft, ChevronRight, Calendar, Eye, ArrowRight } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import NewsCard from '../components/NewsCard';
import { GridSkeleton, CardSkeleton } from '../components/SkeletonLoader';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Fetch Latest Articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/news', {
          params: {
            page,
            limit: 20, // 8 articles per page in the clean grid layout
            search: searchQuery,
          },
        });
        setArticles(data.articles || []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, searchQuery]);

  // Fetch Trending Articles (top 4 articles by viewCount)
  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const { data } = await API.get('/news', {
          params: {
            page: 1,
            limit: 4,
            sortBy: 'views',
          },
        });
        setTrending(data.articles || []);
      } catch (err) {
        console.error('Error fetching trending:', err);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const gridArticles = articles;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top since there is no banner
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      {/* Main Body Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: News Grid */}
        <div className="lg:col-span-8 space-y-8">
          {/* <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#DA2824] heading-display flex items-center gap-2 mb-2">
              <Newspaper className="text-[#DA2824]" />
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Journalism'}
            </h2>
            <div className="h-1 w-16 bg-[#DA2824] rounded-full" />
          </div> */}

          {loading ? (
            <GridSkeleton count={searchQuery ? 6 : 6} />
          ) : gridArticles.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border border-slate-200/80 space-y-3 bg-white">
              <Newspaper className="mx-auto text-slate-400" size={48} />
              <h3 className="text-[#DA2824] font-semibold text-lg">No Articles Found</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                We couldn't find any news articles matching your request. Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridArticles.map((article) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
        {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 pt-12 flex-wrap">
    
    {/* Previous */}
    <button
      onClick={() => handlePageChange(page - 1)}
      disabled={page === 1}
      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#DA2824] hover:text-[#DA2824] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
    >
      Previous
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`w-11 h-11 rounded-xl font-bold transition-all duration-300 ${
          page === pageNum
            ? 'bg-[#DA2824] text-white shadow-lg shadow-red-600/20'
            : 'bg-white border border-slate-200 text-slate-700 hover:border-[#DA2824] hover:text-[#DA2824]'
        }`}
      >
        {pageNum}
      </button>
    ))}

    {/* Next */}
    <button
      onClick={() => handlePageChange(page + 1)}
      disabled={page === totalPages}
      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#DA2824] hover:text-[#DA2824] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
    >
      Next
    </button>
  </div>
)}
        </div>

        {/* Right Column: Trending Sidebar */}
{/* Right Column: Trending Sidebar */}
          <div className="hidden lg:block lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#DA2824] heading-display flex items-center gap-2 mb-2">
              <TrendingUp className="text-[#DA2824]" />
              Trending News
            </h2>
            <div className="h-1 w-16 bg-[#DA2824] rounded-full" />
          </div>

          {trendingLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 glass rounded-xl border border-slate-200/60 animate-pulse bg-white">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-3.5 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    <div className="h-2 w-12 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : trending.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No trending articles yet.</p>
          ) : (
            <div className="space-y-4">
              {trending.map((article, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={article._id}
                  className="flex gap-4 p-3  border border-slate-100 bg-white hover:shadow-md transition-all duration-300 group shadow-sm"
                >
                  {/* Mini Image */}
                  <div className="w-20 h-20  overflow-hidden shrink-0 aspect-square border border-slate-100">
                    <img
                      src={getImageUrl(article.thumbnailImage)}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between py-0.5 flex-grow">
                    <h4 className="text-black text-sm font-bold line-clamp-2 leading-snug group-hover:text-[#DA2824] transition-colors">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h4>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={10} className="text-[#DA2824]" />
                        {article.viewCount || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
