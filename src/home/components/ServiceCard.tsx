import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, MapPin, Calendar } from 'lucide-react';
import { Card } from './ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  gradient: string;
  delay: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  to,
  gradient,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Link to={to}>
        <Card className="h-full group overflow-hidden relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          <div className="relative z-10 p-8">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              {icon}
            </motion.div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            
            <p className="text-slate-600 leading-relaxed mb-6">
              {description}
            </p>
            
            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span>Explorer</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
