import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ExternalLink, MapPin, Camera, Calendar, Map } from 'lucide-react';
import { getCustomers } from '../lib/customerService';

interface Customer {
  id: number;
  documentId: string;
  name: string;
  logo_text: string;
  description: string;
  website?: string;
  industry: string;
  employees: number;
  revenue: string;
  founded: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  gallery?: Array<{
    id: number;
    name: string;
    url: string;
  }>;
  partnership_date: string;
  sort_order: number;
  locale: string;
}

export const OurCustomers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('business');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('خطا در بارگذی اطلاعات مشتریان');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveTab('business');
  };

  const closeModal = () => {
    setSelectedCustomer(null);
  };

  const renderTabContent = () => {
    if (!selectedCustomer) return null;

    switch (activeTab) {
      case 'business':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              اطلاعات کسب و کار
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">صنعت</label>
                <p className="text-white">{selectedCustomer.industry}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">تعداد کارمندان</label>
                <p className="text-white">{selectedCustomer.employees}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">درآمد سالانه</label>
                <p className="text-white">{selectedCustomer.revenue}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">سال تأسیس</label>
                <p className="text-white">{selectedCustomer.founded}</p>
              </div>
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              آدرس و نقشه
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">آدرس</label>
                <p className="text-white">{selectedCustomer.street}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">شهر</label>
                <p className="text-white">{selectedCustomer.city}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">کشور</label>
                <p className="text-white">{selectedCustomer.country}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">تلفن</label>
                <p className="text-white">{selectedCustomer.phone}</p>
              </div>
              <div className="glass-card p-4 md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1">ایمیل</label>
                <p className="text-white">{selectedCustomer.email}</p>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="mt-6 glass-card p-4">
              <h4 className="font-medium text-white/90 mb-2">نقشه موقعیت</h4>
              <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-xl w-full h-64 flex items-center justify-center text-white/60">
                <Map className="w-12 h-12 text-emerald-400/50" />
                <span className="ml-2">نقشه موقعیت کسب و کار</span>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              گالری
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCustomer.gallery?.map((image, index) => (
                <div key={image.id} className="aspect-w-16 aspect-h-9 glass-card overflow-hidden rounded-xl">
                  <img
                    src={image.url.startsWith('http') ? image.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${image.url}`}
                    alt={`${selectedCustomer.name} - ${image.name}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/300x200/6b7280/ffffff?text=Image+Not+Found';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'partnership':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              تاریخ آغاز همکاری
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">تاریخ شروع همکاری</label>
                <p className="text-white">{selectedCustomer.partnership_date}</p>
              </div>
              <div className="glass-card p-4">
                <label className="block text-sm font-medium text-white/70 mb-1">وضعیت همکاری</label>
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-300 bg-green-500/20 rounded-full">
                  فعال
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-white text-lg">در حال بارگذاری مشتریان...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-red-400 text-lg text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-emerald-400" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            مشتریان ما
          </h2>
        </div>
        <p className="text-white/70 text-lg font-semibold max-w-2xl mx-auto">
          لیستی از مشتریان ارزشمند که به ما اعتماد کرده‌اند
        </p>
      </motion.div>

      {/* Logo Grid/Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {customers.map((customer, index) => (
          <motion.div
            key={customer.documentId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="break-inside-avoid glass-card p-6 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
            onClick={() => openModal(customer)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-emerald-400 text-xl border border-emerald-400/30 group-hover:border-emerald-400/50 transition-colors duration-300">
                {customer.logo_text}
              </div>
              <div className="text-right flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors duration-300">
                  {customer.name}
                </h3>
                <p className="text-sm font-semibold text-white/80">{customer.description}</p>
              </div>
            </div>
            
            {customer.website && (
              <a 
                href={customer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-300"
              >
                مشاهده وب‌سایت
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-90 rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto border border-emerald-400/30 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-20 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-emerald-400 text-2xl border border-emerald-400/30 mb-2">
                    {selectedCustomer.logo_text}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedCustomer.name}</h2>
                  <p className="text-white/70">{selectedCustomer.description}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/50 hover:text-white text-2xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-white/20 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'business', label: 'اطلاعات کسب و کار', icon: Users },
                    { id: 'address', label: 'آدرس و نقشه', icon: MapPin },
                    { id: 'gallery', label: 'گالری', icon: Camera },
                    { id: 'partnership', label: 'همکاری', icon: Calendar }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-emerald-400 text-emerald-400'
                            : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
