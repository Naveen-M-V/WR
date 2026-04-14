import React, { memo } from 'react';

const LoadingOptimized = memo(() => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000814]">
      <div className="relative">
        {/* Optimized spinner with CSS-only animation */}
        <div className="w-12 h-12 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <div className="mt-3 text-green-400 text-center text-sm font-medium">Loading...</div>
      </div>
    </div>
  );
});

LoadingOptimized.displayName = 'LoadingOptimized';

export default LoadingOptimized;
