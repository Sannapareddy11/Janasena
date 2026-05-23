import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../services/api';

const NewsCard = ({ article }) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
  <Link to={`/news/${article.slug}`} className="block h-full">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
     className="flex flex-col overflow-hidden glass-card h-full cursor-pointer group !border-transparent hover:!border-transparent"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={getImageUrl(article.thumbnailImage)}
          alt={article.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {article.status === 'draft' && (
          <span className="absolute top-3 left-3 bg-amber-500/80 backdrop-blur-md text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
            Draft
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-[#DA2824]" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>

          <span className="flex items-center gap-1">
            <Eye size={13} className="text-[#DA2824]" />
            {article.viewCount || 0} views
          </span>
        </div>

        <h3 className="text-[#DA2824] font-bold text-lg heading-display mb-2 line-clamp-2 group-hover:text-[#DA2824] transition-colors">
          {article.title}
        </h3>

        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed flex-grow">
          {article.shortDescription}
        </p>

        {/* <div className="flex items-center gap-1.5 text-[#DA2824] hover:text-[#ef4444] font-semibold text-sm transition-colors mt-auto group">
          Read Full News
          <ArrowRight
            size={15}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </div> */}
      </div>
    </motion.div>
  </Link>
);
};

export default NewsCard;
