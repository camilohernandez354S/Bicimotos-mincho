import React from 'react';
import clsx from 'clsx';

const AdminCard = ({ title, value, trend, icon, color = 'primary', className }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 
                    trend?.startsWith('-') ? 'text-red-600' : 'text-gray-600';

  return (
    <div className={clsx(
      'bg-white shadow-card rounded-xl p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-up group',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <span className={clsx('text-sm font-medium', trendColor)}>
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div className={clsx(
            'p-3 rounded-full transition-all duration-300 group-hover:scale-110',
            colorClasses[color]
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
