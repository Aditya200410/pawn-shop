import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://pawnbackend-xmqa.onrender.com/api'}/data-page`);
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data length:', data.length);
        
        // Check if data is an array and has the expected structure
        if (Array.isArray(data) && data.length > 0) {
          const policiesMap = {};
          data.forEach((policy, index) => {
            console.log(`Policy ${index}:`, policy);
            console.log(`Policy ${index} type:`, policy.type);
            console.log(`Policy ${index} heading:`, policy.heading);
            console.log(`Policy ${index} content:`, policy.content);
            console.log(`Policy ${index} content type:`, typeof policy.content);
            console.log(`Policy ${index} content length:`, policy.content?.length);
            
            if (policy.type && policy.heading && policy.content) {
              policiesMap[policy.type] = policy;
            }
          });
          console.log('Processed policies map:', policiesMap);
          setPolicies(policiesMap);
        } else {
          console.log('No valid policy data found');
          setPolicies({});
          toast.error('No policy data available');
        }
      } else {
        console.log('API response not ok');
        setPolicies({});
        toast.error('Failed to load policies from server');
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to load policies from server');
      setPolicies({});
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: <FileText size={20} /> },
    { id: 'refund', label: 'Refund Policy', icon: <RefreshCw size={20} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={20} /> }
  ];

  const renderContent = (content) => {
    if (!content) {
      console.log('No content provided to renderContent');
      return null;
    }
    
    console.log('Rendering content:', content);
    console.log('Content type:', typeof content);
    console.log('Content length:', content.length);
    
    // Simple content rendering - just split by lines and render as paragraphs
    const lines = content.split('\n').filter(line => line.trim() !== '');
    console.log('Lines found:', lines.length);
    
    return (
      <div className="prose prose-pink max-w-none">
        {lines.map((line, lineIndex) => {
          // Check if this line looks like a header (ends with colon and is short)
          const isHeader = line.trim().endsWith(':') && line.trim().length < 100;
          
          return (
            <div key={lineIndex} className="mb-4">
              {isHeader ? (
                <h3 className="text-xl font-semibold text-rose-900 mb-2">{line.trim()}</h3>
              ) : (
                <p className="text-rose-800 leading-relaxed">{line}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-rose-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-pink-200 border-t-rose-400 rounded-full"
        />
      </div>
    );
  }

  // Check if any policies exist
  const hasPolicies = Object.keys(policies).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-rose-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-400 to-pink-700 py-20"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD6E0" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.3" />
              </linearGradient>
              <pattern id="luxuryPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="url(#luxuryGradient)" opacity="0.6" />
                <circle cx="5" cy="5" r="0.5" fill="#FFD700" opacity="0.4" />
                <circle cx="15" cy="15" r="0.5" fill="#FFD700" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#luxuryPattern)" />
            <rect width="100" height="100" fill="url(#luxuryGradient)" opacity="0.1" />
          </svg>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm border-4 border-rose-200 shadow-lg"
          >
            <Shield size={40} className="text-rose-100" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Legal & Policies
          </h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Transparent information about our terms, refunds, and privacy practices
          </p>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {!hasPolicies ? (
          // No policies available
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-pink-100">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-rose-900 mb-4">
                No Policies Available
              </h2>
              <p className="text-rose-700 mb-6 max-w-md mx-auto">
                Policy content has not been set up yet. Please contact the administrator to add the required policy information.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-pink-50 border border-pink-200 text-pink-600"
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Policies available
          <>
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg border border-rose-200'
                      : 'bg-white text-rose-700 hover:bg-pink-50 border border-pink-100'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                {policies[activeTab] ? (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-3xl font-bold text-rose-900 mb-4">
                        {policies[activeTab].heading}
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
                    </motion.div>
                    
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
                      {(() => {
                        console.log('Rendering policy for tab:', activeTab);
                        console.log('Policy data:', policies[activeTab]);
                        console.log('Policy content:', policies[activeTab].content);
                        return renderContent(policies[activeTab].content);
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-12 border border-pink-100">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-pink-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-rose-900 mb-2">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                      </h3>
                      <p className="text-rose-700">
                        This policy content has not been set up yet.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Policies; 