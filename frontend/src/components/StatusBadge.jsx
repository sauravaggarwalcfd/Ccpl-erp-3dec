export const StatusBadge = ({ status, className = '' }) => {
  const getStatusStyle = (status) => {
    const normalized = status?.toLowerCase().replace(/[\s_]/g, '-');
    switch (normalized) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending-qc':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qc-passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'qc-failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(status)} ${className}`}
      data-testid={`status-badge-${status?.toLowerCase()}`}
    >
      {status}
    </span>
  );
};

export const DataCard = ({ title, value, icon: Icon, change, className = '' }) => {
  return (
    <div className={`bg-white border border-neutral-200 rounded-lg p-6 ${className}`} data-testid={`data-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-3xl font-semibold text-neutral-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {change.type === 'increase' ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};
