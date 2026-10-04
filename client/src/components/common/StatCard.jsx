import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color = 'green', trend, subtext }) {
  const colors = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
  };
  const iconBg = {
    green: 'bg-green-100 dark:bg-green-900/40',
    blue: 'bg-blue-100 dark:bg-blue-900/40',
    orange: 'bg-orange-100 dark:bg-orange-900/40',
    purple: 'bg-purple-100 dark:bg-purple-900/40',
    red: 'bg-red-100 dark:bg-red-900/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card border ${colors[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtext && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBg[color]} rounded-xl flex items-center justify-center`}>
          <Icon className={`text-xl ${colors[color].split(' ')[2]}`} />
        </div>
      </div>
    </motion.div>
  );
}
