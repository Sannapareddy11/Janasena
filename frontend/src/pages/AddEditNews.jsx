import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UploadCloud, Newspaper, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import API, { getImageUrl } from '../services/api';

const AddEditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  
  // Image Uploads
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  // Status/Error States
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch article if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        setFetchLoading(true);
        setError('');
        try {
          const { data } = await API.get(`/admin/news/${id}`);
          setTitle(data.title || '');
          setShortDescription(data.shortDescription || '');
          setContent(data.content || '');
          setStatus(data.status || 'draft');
          
          if (data.thumbnailImage) {
            setThumbnailPreview(getImageUrl(data.thumbnailImage));
          }
          if (data.bannerImage) {
            setBannerPreview(getImageUrl(data.bannerImage));
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch article details. Redirecting...');
          setTimeout(() => navigate('/admin'), 2000);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEditMode, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Field check
    if (!title.trim() || !shortDescription.trim() || !content.trim()) {
      setError('Please fill in title, summary and content.');
      setLoading(false);
      return;
    }

    if (!isEditMode && (!thumbnailFile || !bannerFile)) {
      setError('Both thumbnail and banner images are required for new articles.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('shortDescription', shortDescription.trim());
      formData.append('content', content.trim());
      formData.append('status', status);

      if (thumbnailFile) {
        formData.append('thumbnailImage', thumbnailFile);
      }
      if (bannerFile) {
        formData.append('bannerImage', bannerFile);
      }

      if (isEditMode) {
        await API.put(`/admin/news/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Article updated successfully!');
      } else {
        await API.post('/admin/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Article created and saved successfully!');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Error occurred while saving article.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#DA2824] text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {fetchLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-[#DA2824] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#DA2824] heading-display">
                {isEditMode ? 'Modify Article Details' : 'Compose News Article'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {isEditMode ? 'Apply edits to fields below and update article.' : 'Provide title, description, content, and imagery.'}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-[#DA2824] text-sm p-4 rounded-xl animate-shake">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter a captivating headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] transition-all"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Short Summary
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Summarize the core update in 2-3 sentences..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] transition-all resize-y"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Full Journalism Content
                </label>
                <textarea
                  required
                  rows="10"
                  placeholder="Type the full story here. Separate paragraphs with double spaces/newlines. HTML tags are supported for richer layouts."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] transition-all resize-y font-sans leading-relaxed"
                />
              </div>

              {/* Image Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Thumbnail Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Thumbnail Image (16:9 ratio)
                  </label>
                  <div className="relative border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer h-36">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      required={!isEditMode}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="text-slate-400 group-hover:text-[#DA2824] mb-2 transition-colors" size={24} />
                    <span className="text-xs font-semibold text-slate-600 line-clamp-1 px-2">
                      {thumbnailFile ? thumbnailFile.name : 'Select Thumbnail'}
                    </span>
                    <span className="text-[10px] text-slate-450 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                </div>

                {/* Banner Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Banner/Cover Image (21:9 ratio)
                  </label>
                  <div className="relative border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer h-36">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      required={!isEditMode}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="text-slate-400 group-hover:text-[#DA2824] mb-2 transition-colors" size={24} />
                    <span className="text-xs font-semibold text-slate-600 line-clamp-1 px-2">
                      {bannerFile ? bannerFile.name : 'Select Cover Banner'}
                    </span>
                    <span className="text-[10px] text-slate-450 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                </div>
              </div>

              {/* Status Select & Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider">
                    Article Status:
                  </label>
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setStatus('draft')}
                      className={`px-4 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                        status === 'draft' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:text-[#DA2824] hover:bg-slate-200'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('published')}
                      className={`px-4 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                        status === 'published' ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:text-[#DA2824] hover:bg-slate-200'
                      }`}
                    >
                      Publish
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DA2824] hover:bg-[#e03d39] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      {isEditMode ? 'Update Article' : 'Save Article'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Previews Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-[#DA2824] font-extrabold text-sm uppercase tracking-wider heading-display flex items-center gap-2">
              <Eye className="text-[#DA2824]" size={16} />
              Desktop Live Preview
            </h3>

            {/* Thumbnail Preview Area */}
            {thumbnailPreview && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-sm">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Thumbnail View</span>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <img src={thumbnailPreview} alt="thumbnail preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Banner Preview Area */}
            {bannerPreview && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-sm">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Banner View</span>
                <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <img src={bannerPreview} alt="banner preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 leading-relaxed">
              <strong>Preview Warning</strong>: Ensure uploaded image sizes and ratios roughly match 16:9 for thumbnails (used in lists) and 21:9 for page header cover banners. Live preview uses local browser blob objects before uploads occur.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditNews;
