import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden glass border border-white/5 animate-pulse h-full">
      {/* Thumbnail placeholder */}
      <div className="aspect-video w-full bg-slate-800/40" />

      {/* Content placeholders */}
      <div className="p-5 flex-grow space-y-3">
        <div className="flex gap-4">
          <div className="h-3 w-16 bg-slate-800/40 rounded-full" />
          <div className="h-3 w-16 bg-slate-800/40 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-800/60 rounded-md" />
          <div className="h-4 w-5/6 bg-slate-800/60 rounded-md" />
        </div>
        <div className="space-y-1.5 pt-2">
          <div className="h-3 w-full bg-slate-800/30 rounded-md" />
          <div className="h-3 w-full bg-slate-800/30 rounded-md" />
          <div className="h-3 w-4/5 bg-slate-800/30 rounded-md" />
        </div>
        <div className="h-3.5 w-24 bg-slate-800/50 rounded-md pt-4" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      {/* Banner placeholder */}
      <div className="w-full aspect-[21/9] bg-slate-800/30 rounded-xl" />

      {/* Title block */}
      <div className="space-y-3">
        <div className="h-8 w-3/4 bg-slate-800/60 rounded-lg" />
        <div className="h-8 w-1/2 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Meta block */}
      <div className="flex gap-4 items-center">
        <div className="h-4 w-24 bg-slate-800/40 rounded-full" />
        <div className="h-4 w-20 bg-slate-800/40 rounded-full" />
        <div className="h-4 w-16 bg-slate-800/40 rounded-full" />
      </div>

      {/* Content lines */}
      <div className="space-y-3 pt-6 border-t border-slate-900">
        <div className="h-3.5 w-full bg-slate-800/30 rounded-md" />
        <div className="h-3.5 w-full bg-slate-800/30 rounded-md" />
        <div className="h-3.5 w-5/6 bg-slate-800/30 rounded-md" />
        <div className="h-3.5 w-11/12 bg-slate-800/30 rounded-md" />
        <div className="h-3.5 w-full bg-slate-800/30 rounded-md" />
        <div className="h-3.5 w-4/5 bg-slate-800/30 rounded-md" />
      </div>
    </div>
  );
};

export default {
  CardSkeleton,
  GridSkeleton,
  DetailSkeleton,
};
