import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Newspaper,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  EyeOff,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import API, { getImageUrl } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'news'
  const [analytics, setAnalytics] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of item undergoing delete/publish toggle
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  // Fetch Analytics data
  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/admin/dashboard');
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching admin dashboard analytics:', err);
    }
  };

  // Fetch News data (paginated and searchable)
  const fetchNewsList = async () => {
    try {
      const { data } = await API.get('/news', {
        params: {
          page,
          limit: 10,
          isAdminQuery: 'true',
          search: searchQuery,
        },
      });
      setNewsList(data.articles || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching admin news list:', err);
    }
  };

  // Combined Initializer/Reloader
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchNewsList()]);
      setLoading(false);
    };
    loadDashboardData();
  }, [page, searchQuery]);

  // Handle Publish/Unpublish status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    setActionLoading(id);
    try {
      await API.put(`/admin/news/${id}`, { status: nextStatus });
      // Update local states
      await Promise.all([fetchAnalytics(), fetchNewsList()]);
    } catch (err) {
      console.error('Error toggling article status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete
  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) {
      return;
    }
    setActionLoading(id);
    try {
      await API.delete(`/admin/news/${id}`);
      await Promise.all([fetchAnalytics(), fetchNewsList()]);
    } catch (err) {
      console.error('Error deleting article:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[70vh]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-[#DA2824] font-extrabold text-sm uppercase tracking-wider heading-display mb-4">
            Admin Panel
          </h3>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#DA2824] text-white shadow-lg shadow-red-600/10'
                  : 'text-slate-650 hover:text-[#DA2824] hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-[#DA2824] text-white shadow-lg shadow-red-600/10'
                  : 'text-slate-650 hover:text-[#DA2824] hover:bg-slate-50'
              }`}
            >
              <Newspaper size={18} />
              Article Manager
            </button>
          </nav>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex flex-col gap-3">
          <Link
            to="/admin/news/new"
            className="flex items-center justify-center gap-2 w-full bg-[#DA2824] hover:bg-[#e03d39] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-300"
          >
            <Plus size={16} />
            Create News
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-[#DA2824] border border-[#DA2824]/20 hover:border-[#DA2824] text-[#DA2824] hover:text-white rounded-xl py-3 text-sm font-semibold transition-all duration-300 cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 min-h-[60vh] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-[#DA2824] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'analytics' ? (
          /* TAB 1: ANALYTICS DASHBOARD */
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-[#DA2824] heading-display">Dashboard Overview</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time metrics, article engagement, and publishing counts.</p>
            </div>

            {analytics && (
              <>
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Card 1: Total News */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#DA2824]/30 hover:shadow-md transition-all duration-300">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Articles</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-black heading-display">{analytics.totalNews}</span>
                    <Newspaper className="absolute right-4 bottom-4 text-[#DA2824]/10 group-hover:text-[#DA2824]/20 transition-all duration-300" size={56} />
                  </div>

                  {/* Card 2: Published */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-green-500/30 hover:shadow-md transition-all duration-300">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Published</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-green-650 heading-display">{analytics.publishedNews}</span>
                    <CheckCircle className="absolute right-4 bottom-4 text-green-500/10 group-hover:text-green-500/20 transition-all duration-300" size={56} />
                  </div>

                  {/* Card 3: Drafts */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-amber-500/30 hover:shadow-md transition-all duration-300">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Drafts</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-amber-650 heading-display">{analytics.draftNews}</span>
                    <FileText className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all duration-300" size={56} />
                  </div>

                  {/* Card 4: Total Views */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-red-500/30 hover:shadow-md transition-all duration-300">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Engagement</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-black heading-display">{analytics.totalViews}</span>
                    <Eye className="absolute right-4 bottom-4 text-[#DA2824]/10 group-hover:text-[#DA2824]/20 transition-all duration-300" size={56} />
                  </div>
                </div>

                {/* Popular vs Recent Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                  {/* Column A: Top Trending News */}
                  <div className="space-y-4">
                    <h3 className="text-[#DA2824] font-bold text-base uppercase tracking-wider heading-display flex items-center gap-2">
                      <TrendingUp className="text-[#DA2824] animate-bounce" size={18} />
                      Top Performing News
                    </h3>
                    <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                      {analytics.popularNews?.map((item) => (
                        <div key={item._id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors">
                          <Link to={`/news/${item.slug}`} className="text-sm font-semibold text-black hover:text-[#DA2824] transition-colors line-clamp-1 flex-1">
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-slate-500">
                              <Eye size={12} className="text-[#DA2824]" />
                              {item.viewCount}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              item.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column B: Recent Submissions */}
                  <div className="space-y-4">
                    <h3 className="text-[#DA2824] font-bold text-base uppercase tracking-wider heading-display flex items-center gap-2">
                      <Newspaper className="text-[#DA2824]" size={18} />
                      Recent Uploads
                    </h3>
                    <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                      {analytics.recentNews?.map((item) => (
                        <div key={item._id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors">
                          <Link to={`/news/${item.slug}`} className="text-sm font-semibold text-black hover:text-[#DA2824] transition-colors line-clamp-1 flex-1">
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-slate-500">{formatDate(item.createdAt)}</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              item.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* TAB 2: ARTICLE LIST TABLE */
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#DA2824] heading-display">Article Manager</h2>
                <p className="text-slate-500 text-sm mt-1">Publish, edit, search, and delete news articles.</p>
              </div>
              
              {/* Search in dashboard */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3.5 pr-10 text-sm text-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-4 px-4">Article</th>
                    <th className="py-4 px-4 hidden md:table-cell">Published Date</th>
                    <th className="py-4 px-4">Stats</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-black">
                  {newsList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400 italic">
                        No articles available. Create your first news article now!
                      </td>
                    </tr>
                  ) : (
                    newsList.map((article) => (
                       <tr key={article._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3.5">
                          <img
                            src={getImageUrl(article.thumbnailImage)}
                            alt={article.title}
                            className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-100"
                          />
                          <div className="max-w-[200px] md:max-w-xs">
                            <h4 className="font-bold text-black line-clamp-1 leading-snug hover:text-[#DA2824]">
                              <Link to={`/news/${article.slug}`}>{article.title}</Link>
                            </h4>
                            <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {article.shortDescription}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <span className="text-slate-500">
                            {formatDate(article.publishedAt || article.createdAt)}
                          </span>
                        </td>
                        
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                            <Eye size={13} className="text-[#DA2824]" />
                            {article.viewCount || 0}
                          </span>
                        </td>
                        
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(article._id, article.status)}
                            disabled={actionLoading === article._id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer border select-none transition-all disabled:opacity-50 ${
                              article.status === 'published'
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {article.status === 'published' ? (
                              <>
                                <CheckCircle size={11} />
                                Published
                              </>
                            ) : (
                              <>
                                <AlertCircle size={11} />
                                Draft
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/news/edit/${article._id}`}
                              className="p-1.5 bg-red-50 hover:bg-[#DA2824] text-[#DA2824] hover:text-white rounded-lg border border-[#DA2824]/20 hover:border-[#DA2824] transition-colors"
                            >
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article._id)}
                              disabled={actionLoading === article._id}
                              className="p-1.5 bg-red-50 hover:bg-[#DA2824] text-[#DA2824] hover:text-white rounded-lg border border-[#DA2824]/20 hover:border-[#DA2824] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2.5 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="bg-white border border-slate-200 text-slate-650 hover:text-[#DA2824] hover:bg-slate-50 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="bg-white border border-slate-200 text-slate-650 hover:text-[#DA2824] hover:bg-slate-50 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
