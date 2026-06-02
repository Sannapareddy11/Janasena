import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Eye, User, ArrowLeft, Share2, Link2 } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import NewsCard from '../components/NewsCard';
import { DetailSkeleton } from '../components/SkeletonLoader';

const NewsDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(window.location.href);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/news/${slug}`);
        setArticle(data.news);
        setRelated(data.relatedNews || []);
        if (data.detailPageUrl) {
          setPageUrl(data.detailPageUrl);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        // Redirect to home if 404 or invalid slug
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [slug, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Content formatting helper
  const renderContent = (content) => {
    if (!content) return null;
    
    // Check if content is HTML (e.g. from rich text editor)
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      return <div className="prose max-w-none text-black prose-headings:text-[#DA2824] prose-a:text-[#DA2824] prose-strong:text-slate-900 leading-relaxed text-base md:text-lg" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Split plain text by double newlines into paragraphs
    return content.split('\n\n').map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      return (
        <p key={index} className="mb-6 leading-relaxed text-black text-base md:text-lg">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      {/* <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#DA2824] text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Headlines
        </Link>
      </div> */}

      {article && (
        <>
  <Helmet>
    <title>{article.title}</title>

    <meta
      name="description"
      content={article.shortDescription || article.title}
    />

    {/* Open Graph */}
    <meta property="og:type" content="article" />

    <meta
      property="og:title"
      content={article.title}
    />

    <meta
      property="og:description"
      content={article.shortDescription || article.title}
    />

    <meta
      property="og:image"
      content={getImageUrl(article.bannerImage)}
    />

    <meta
      property="og:url"
      content={pageUrl}
    />

    {/* Twitter / WhatsApp */}
    <meta
      name="twitter:card"
      content="summary_large_image"
    />

    <meta
      name="twitter:title"
      content={article.title}
    />

    <meta
      name="twitter:description"
      content={article.shortDescription || article.title}
    />

    <meta
      name="twitter:image"
      content={getImageUrl(article.bannerImage)}
    />
  </Helmet>
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Banner Image */}
<div className="w-full h-[250px] md:h-[450px] overflow-hidden glass-panel shadow-xl border border-slate-200 bg-slate-50/60">
  <img
    src={getImageUrl(article.bannerImage)}
    alt={article.title}
    className="w-full h-full object-cover"
  />
</div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-lg md:text-4xl lg:text-3xl font-extrabold text-[#DA2824] heading-display leading-tight">
              {article.title}
            </h1>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs md:text-sm text-slate-500 border-y border-slate-200 py-3">
              {/* <span className="flex items-center gap-1.5">
                <User size={15} className="text-[#DA2824]" />
                Published by <span className="text-slate-800 font-semibold">{article.createdBy?.name || 'Journalist'}</span>
              </span> */}
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="text-[#DA2824]" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={15} className="text-[#DA2824]" />
                {article.viewCount || 0} views
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="border-b border-slate-200 ">
            {renderContent(article.content)}
          </div>

          {/* Share Section */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Share2 size={16} className="text-[#DA2824]" />
              <span className="font-semibold text-black">Spread the Word:</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3"
              >
                <Link2 size={14} />
                {shareCopied ? 'Copied!' : 'Copy Link'}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#1da1f2] hover:bg-slate-100 p-2.5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
               href={`https://wa.me/?text=${encodeURIComponent(
                pageUrl
              )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white hover:scale-110 p-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg shadow-green-500/20"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 32 32"
                >
                  <path d="M19.11 17.24c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.47-1.84-.16-.27-.02-.41.12-.55.13-.13.27-.34.41-.52.14-.18.18-.31.27-.52.09-.2.05-.38-.02-.52-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.64 1.11 2.82c.14.18 1.91 2.92 4.64 4.09.65.28 1.16.45 1.56.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.11-.25-.18-.52-.31zM16.02 3C8.84 3 3 8.84 3 16c0 2.53.74 4.99 2.13 7.09L3 29l6.11-2.01A12.94 12.94 0 0 0 16.02 29C23.2 29 29 23.16 29 16S23.2 3 16.02 3zm0 23.67c-2.15 0-4.25-.58-6.08-1.68l-.43-.26-3.63 1.19 1.21-3.54-.28-.45A10.6 10.6 0 0 1 5.4 16c0-5.86 4.76-10.62 10.62-10.62S26.64 10.14 26.64 16s-4.76 10.67-10.62 10.67z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#1877f2] hover:bg-slate-100 p-2.5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
       </motion.article>
</>
)}

      {/* Related News Section */}
      {related.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#DA2824] heading-display flex items-center gap-2 mb-2">
              Related News
            </h3>
            <div className="h-0.5 w-12 bg-[#DA2824] rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
