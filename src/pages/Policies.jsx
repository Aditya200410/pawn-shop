import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://pawnbackend-xmqa.onrender.com/api'}/data-page`);
      if (response.ok) {
        const data = await response.json();
        const policiesMap = {};
        data.forEach(policy => {
          policiesMap[policy.type] = policy;
        });
        setPolicies(policiesMap);
      } else {
        // If no data from backend, use default content
        setPolicies({
          terms: {
            type: 'terms',
            heading: 'Terms and Conditions',
            content: defaultTermsContent
          },
          refund: {
            type: 'refund',
            heading: 'Refund Policy',
            content: defaultRefundContent
          },
          privacy: {
            type: 'privacy',
            heading: 'Privacy Policy',
            content: defaultPrivacyContent
          }
        });
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to load policies');
      // Use default content on error
      setPolicies({
        terms: {
          type: 'terms',
          heading: 'Terms and Conditions',
          content: defaultTermsContent
        },
        refund: {
          type: 'refund',
          heading: 'Refund Policy',
          content: defaultRefundContent
        },
        privacy: {
          type: 'privacy',
          heading: 'Privacy Policy',
          content: defaultPrivacyContent
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: <FileText size={20} /> },
    { id: 'refund', label: 'Refund Policy', icon: <RefreshCw size={20} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={20} /> }
  ];

  const renderContent = (content) => {
    if (!content) return null;
    
    // Split content into sections based on headers
    const sections = content.split(/(?=^[A-Z][^:]*:)/m).filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const header = lines[0];
      const body = lines.slice(1).join('\n').trim();
      const sectionId = `${activeTab}-${index}`;
      const isExpanded = expandedSections[sectionId];

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-6"
        >
          <button
            onClick={() => toggleSection(sectionId)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl hover:from-pink-100 hover:to-rose-200 transition-all duration-300 border border-pink-100"
          >
            <h3 className="text-lg font-semibold text-rose-900">{header}</h3>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white border border-t-0 border-pink-100 rounded-b-xl">
                  <div className="prose prose-pink max-w-none">
                    {body.split('\n').map((line, lineIndex) => (
                      <p key={lineIndex} className="text-rose-800 leading-relaxed mb-3">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-rose-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-pink-200 border-t-rose-400 rounded-full"
        />
      </div>
    );
  }

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
            {policies[activeTab] && (
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
                  {renderContent(policies[activeTab].content)}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Default content if backend data is not available
const defaultTermsContent = `Terms and Conditions:
Welcome to RikoCraft. By accessing our website, you agree to these terms and conditions.

Acceptance of Terms:
By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.

User Accounts:
You are responsible for maintaining the confidentiality of your account information and for all activities under your account.

Product Information:
We strive to provide accurate product descriptions, but we do not warrant that product descriptions are accurate, complete, or current.

Pricing and Payment:
All prices are subject to change without notice. Payment must be made at the time of order placement.

Shipping and Delivery:
Delivery times are estimates only. We are not responsible for delays beyond our control.

Returns and Refunds:
Please refer to our Refund Policy for detailed information about returns and refunds.

Intellectual Property:
All content on this website is protected by copyright and other intellectual property laws.

Limitation of Liability:
We shall not be liable for any indirect, incidental, or consequential damages.

Governing Law:
These terms are governed by the laws of India.`;

const defaultRefundContent = `Refund Policy:
We want you to be completely satisfied with your purchase from RikoCraft.

Eligibility for Refunds:
Items must be returned within 30 days of delivery in their original condition.

Return Process:
Contact our customer service team to initiate a return. Provide your order number and reason for return.

Return Shipping:
Customers are responsible for return shipping costs unless the item is defective or incorrect.

Refund Timeline:
Refunds are processed within 5-7 business days after we receive your return.

Non-Refundable Items:
Custom or personalized items cannot be returned unless defective.

Damaged Items:
If you receive a damaged item, contact us immediately with photos for replacement or refund.

Quality Issues:
We stand behind the quality of our products. Contact us for any quality concerns.

Refund Methods:
Refunds are issued to the original payment method used for the purchase.

International Returns:
International customers may be subject to additional shipping and customs fees.

Contact Information:
For return inquiries, email us at support@rikocraft.com or call our customer service.`;

const defaultPrivacyContent = `Privacy Policy:
Your privacy is important to us. This policy explains how we collect, use, and protect your information.

Information We Collect:
We collect information you provide directly to us, such as name, email, address, and payment information.

How We Use Information:
We use your information to process orders, communicate with you, and improve our services.

Information Sharing:
We do not sell, trade, or rent your personal information to third parties.

Data Security:
We implement appropriate security measures to protect your personal information.

Cookies and Tracking:
We use cookies to enhance your browsing experience and analyze website traffic.

Third-Party Services:
We may use third-party services for payment processing and analytics.

Data Retention:
We retain your information as long as necessary to provide our services and comply with legal obligations.

Your Rights:
You have the right to access, update, or delete your personal information.

Children's Privacy:
Our services are not intended for children under 13 years of age.

Changes to Policy:
We may update this privacy policy from time to time.`;

export default Policies; 