import React from 'react';
import type { Offer } from '../api/jobfinder.api';

interface JobCardProps {
    offer: Offer;
    onViewDetails: (id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ offer, onViewDetails }) => {
    const postedAt = new Date(offer.createdAt);
    const daysAgo = Math.floor((Date.now() - postedAt.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex justify-between items-start gap-4">
            <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{offer.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Company #{offer.companyId}</p>

                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        📍 {offer.city}
                    </span>
                    <span className="flex items-center gap-1">
                        🗂 {offer.contractType}
                    </span>
                    {offer.salary && (
                        <span className="flex items-center gap-1">
                            💰 {offer.salary}
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{offer.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                    Posted {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
                </p>
            </div>

            <button
                onClick={() => onViewDetails(offer.id)}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
                View details
            </button>
        </div>
    );
};

export default JobCard;