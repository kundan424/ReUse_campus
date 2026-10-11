import React from 'react';
import Link from 'next/link';
import { getCategoryById } from '@/lib/categories';
import StatusBadge from './StatusBadge';

export default function ResourceCard({ resource }) {
  const cat = getCategoryById(resource.category);

  // Fallback category images if resource imageUrl is empty
  const defaultImages = {
    books: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    electronics: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    lab_supplies: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    furniture: 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?auto=format&fit=crop&w=800&q=80',
    event_supplies: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    everyday_reusable: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    other: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
  };

  const imageSrc = resource.imageUrl || defaultImages[resource.category] || defaultImages.other;

  return (
    <div className="group bg-white hairline-border flex flex-col justify-between transition-all duration-300 hover:shadow-wood-hover hover:border-[#CDC5B8]">
      {/* Visual Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EDE4]">
        <img
          src={imageSrc}
          alt={resource.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <StatusBadge status={resource.status} />
        </div>
        <div className="absolute bottom-3 right-3 bg-[#1C1B18]/85 text-[#FAF8F5] text-[10px] tracking-[0.14em] uppercase font-medium px-2 py-0.5 backdrop-blur-sm">
          {resource.availableQuantity} of {resource.quantity} Available
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#8A8276] font-medium">
            <span>{cat.name}</span>
            <span className="capitalize text-[#4C473E]">{resource.condition.replace('_', ' ')}</span>
          </div>

          {/* Title */}
          <h3 className="font-editorial text-xl font-medium text-[#1C1B18] line-clamp-2 leading-snug group-hover:text-[#694830] transition-colors">
            {resource.title}
          </h3>

          {/* Description snippet */}
          <p className="text-[13px] text-[#635E55] line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Location & Donor Footer */}
        <div className="pt-6 mt-6 hairline-top space-y-3">
          <div className="flex items-start justify-between text-[11px] text-[#7A746B]">
            <span className="text-[#36332E] font-medium line-clamp-1">
              📍 {resource.location}
            </span>
            <span className="tracking-[0.1em] uppercase text-[9px] text-[#9E978C] font-semibold whitespace-nowrap pl-2">
              {resource.owner?.departmentName || 'Campus Member'}
            </span>
          </div>

          <Link
            href={`/resources/${resource._id}`}
            className="block text-center w-full py-2.5 text-[11px] tracking-[0.16em] uppercase font-semibold text-[#1C1B18] bg-[#FAF8F5] hover:bg-[#1C1B18] hover:text-[#FAF8F5] transition-all hairline-border"
          >
            Review Specifications →
          </Link>
        </div>
      </div>
    </div>
  );
}
