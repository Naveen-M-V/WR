import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X, Crown, Star } from 'lucide-react';

const NotificationPopup = ({ isVisible, onClose, subscriptionType, userName }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  const isPremium = subscriptionType === 'premium';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Notification Popup */}
      <div 
        className={`relative transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className={`
          w-full max-w-md p-8 rounded-3xl shadow-2xl border-2
          ${isPremium 
            ? 'bg-gradient-to-br from-purple-50/90 to-yellow-50/90 border-purple-300/50' 
            : 'bg-gradient-to-br from-blue-50/90 to-green-50/90 border-blue-300/50'
          }
          backdrop-blur-xl
        `}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/30 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className={`
              relative p-4 rounded-full
              ${isPremium 
                ? 'bg-gradient-to-br from-purple-500/20 to-yellow-500/20' 
                : 'bg-gradient-to-br from-blue-500/20 to-green-500/20'
              }
            `}>
              <CheckCircle className={`
                w-12 h-12
                ${isPremium ? 'text-purple-600' : 'text-green-600'}
              `} />
              {isPremium && (
                <Crown className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500" />
              )}
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h2 className={`
              text-2xl font-bold
              ${isPremium 
                ? 'bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent' 
                : 'text-gray-800'
              }
            `}>
              🎉 Welcome to Which Renewables!
            </h2>
            
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
              ${isPremium 
                ? 'bg-gradient-to-r from-purple-500/20 to-yellow-500/20 text-purple-700 border border-purple-300/50' 
                : 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-700 border border-blue-300/50'
              }
            `}>
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Premium Member</span>
                  <Star className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Standard Member</span>
                </>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">
              {userName && <span className="font-semibold">Hi {userName}!</span>}<br />
              Your account has been successfully created and your payment has been processed.
            </p>

            {/* Subscription Benefits */}
            <div className={`
              p-4 rounded-2xl text-left
              ${isPremium 
                ? 'bg-gradient-to-r from-purple-100/50 to-yellow-100/50 border border-purple-200/50' 
                : 'bg-gradient-to-r from-blue-100/50 to-green-100/50 border border-blue-200/50'
              }
            `}>
              <h3 className="font-semibold text-gray-800 mb-2">Your Benefits:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Annual credit: £{isPremium ? '600' : '300'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Access to exclusive services</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Loyalty points program</span>
                </li>
                {isPremium && (
                  <>
                    <li className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Priority customer support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Advanced analytics & insights</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className={`
                w-full py-3 px-6 rounded-xl font-semibold text-white
                shadow-lg transition-all duration-300 hover:shadow-xl
                ${isPremium 
                  ? 'bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                }
              `}
            >
              Start Exploring
            </button>
          </div>

          {/* Decorative Elements */}
          {isPremium && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-4 right-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-1000"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
