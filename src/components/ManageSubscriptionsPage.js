import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Calendar, Star, DollarSign, AlertCircle, CheckCircle, Zap, Crown, Package, ArrowLeft, RefreshCw, ShoppingCart, Lock, X, Upload, ChevronDown, Pencil } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import ScrollingBanner from './home/ScrollingBanner';

const addonServicesList = [
  { id: "company-spotlight", name: "Company 'Under The Spotlight'", price: 300.00 },
  { id: "product-spotlight", name: "Product or Service 'Under The Spotlight'", price: 300.00 },
  { id: "hall-of-fame", name: "'Hall Of Fame - Industry Heroes'", price: 300.00 },
  { id: "industry-awards", name: "Showcase your company's Award on our 'Industry Awards' page", price: 300.00 },
  { id: "case-study-showcase", name: "Showcase your recent successful 'Case Study'", price: 300.00 },
  { id: "completed-project-showcase", name: "Showcase your 'Recently Completed Project'", price: 300.00 },
  { id: "innovations-showcase", name: "Showcase the latest 'Innovations'", price: 300.00 },
  { id: "additional-recruitment", name: "Additional 6 x recruitment vacancies", price: 300.00 },
  { id: "additional-service", name: "Additional 6 x service listings", price: 300.00 }
];

const ManageSubscriptionsPage = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasingAddon, setPurchasingAddon] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const fieldStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "12px 14px",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    outline: "none",
  };

  const fieldBase = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "12px 14px",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    outline: "none",
  };

  const [activeAddonModal, setActiveAddonModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [modalFormData, setModalFormData] = useState({
    name: '',
    companyName: '',
    description: '',
    image: null,
    images: []
  });
  
  const [innovationFormData, setInnovationFormData] = useState({
    companyName: '',
    companyLogo: '',
    category: '',
    type: 'product',
    name: '',
    image: '',
    description: '',
    keyFeatures: ['', '', '', ''],
    link: '',
    status: 'Upcoming'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  
  const modalContentRef = useRef(null);
  const scrollPositionRef = useRef(0);
  
  const [awardsItems, setAwardsItems] = useState([]);
  const [hallOfFameItems, setHallOfFameItems] = useState([]);
  const [caseStudyItems, setCaseStudyItems] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [innovationsItems, setInnovationsItems] = useState([]);

  // ── HELPER: resolve company ID from whatever shape the API returns ──
  const getCompanyId = (data) => {
    if (!data) return null;
    return data.id || data.companyId || null;
  };

  useEffect(() => {
    fetchCompanySubscription();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');
    
    if (paymentStatus === 'success') {
      setSuccessMessage('Payment successful! Your addon(s) have been activated.');
      
      const lastAddonId = localStorage.getItem('lastAddonPurchase');
      const lastAddonsIds = localStorage.getItem('lastAddonsPurchase');
      
      if (lastAddonId || lastAddonsIds) {
        const token = localStorage.getItem('authToken');
        const confirmData = lastAddonsIds 
          ? { addonIds: JSON.parse(lastAddonsIds), sessionId: sessionId }
          : { addonId: lastAddonId, sessionId: sessionId };
        
        fetch(`${API_BASE_URL}/confirm-addon-purchase`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(confirmData),
        })
          .then(res => res.json())
          .then(data => {
            console.log('Addon purchase confirmed:', data);
            fetchCompanySubscription();
            localStorage.removeItem('lastAddonPurchase');
            localStorage.removeItem('lastAddonsPurchase');
          })
          .catch(err => {
            console.error('Error confirming addon:', err);
            fetchCompanySubscription();
          });
      } else {
        const timer = setTimeout(() => {
          fetchCompanySubscription();
        }, 1000);
        return () => clearTimeout(timer);
      }
      
      const messageTimer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      window.history.replaceState({}, '', window.location.pathname);
      
      return () => clearTimeout(messageTimer);
    } else if (paymentStatus === 'cancelled') {
      setError('Payment was cancelled. You can try again when ready.');
      
      const errorTimer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      window.history.replaceState({}, '', window.location.pathname);
      
      return () => clearTimeout(errorTimer);
    }
  }, []);

  useEffect(() => {
    if (modalContentRef.current && activeAddonModal?.id === 'innovations-showcase') {
      requestAnimationFrame(() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTop = scrollPositionRef.current;
        }
      });
    }
  }, [activeAddonModal?.id]);

  const fetchCompanySubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/companies/my-company`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSubscription(data.data.subscription || null);
        setCompanyData(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch subscription details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName) => {
    const p = String(planName || '').toLowerCase();
    if (p.includes('premium')) return <Zap className="w-6 h-6 text-purple-400" />;
    if (p.includes('elite')) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (p.includes('standard') || p.includes('professional')) return <Star className="w-6 h-6 text-blue-400" />;
    return <Star className="w-6 h-6 text-white/70" />;
  };

  const getPlanName = (plan) => {
    if (!plan) return 'Unknown Plan';
    if (typeof plan === 'string') return plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
    if (plan.name) return plan.name;
    return 'Active Plan';
  };

  const getUpgradeInfo = () => {
    const planName = String(subscription?.plan || '').toLowerCase();
    if (planName.includes('elite')) {
      return { canUpgrade: false, targetPlan: null, buttonText: null };
    }
    if (planName.includes('professional')) {
      return { canUpgrade: true, targetPlan: 'elite', buttonText: 'Upgrade to Elite' };
    }
    return { canUpgrade: true, targetPlan: null, buttonText: 'Upgrade Plan' };
  };

  const getAddonName = (addonId) => {
    const addon = addonServicesList.find(a => a.id === addonId);
    return addon ? addon.name : addonId;
  };

  const getAddonPrice = (addonId) => {
    const addon = addonServicesList.find(a => a.id === addonId);
    return addon ? addon.price : null;
  };

  const isAddonPurchased = (addonId) => {
    if (!subscription || !subscription.addons) return false;
    return subscription.addons.includes(addonId);
  };

  const getCompanyTabItems = (tabKey) => {
    const items = companyData?.tabs?.[tabKey]?.items;
    return Array.isArray(items) ? items : [];
  };

  const getAwardsByType = (type) => {
    const items = getCompanyTabItems('awards');
    return items.filter(item => (item.awardType || 'award') === type);
  };

  const buildSelectableTabItems = (tabKey) => {
    return getCompanyTabItems(tabKey)
      .map((item, index) => ({
        key: item?.id ? `id:${item.id}` : `idx:${index}`,
        index,
        item,
        label: item?.title || item?.name || `Item ${index + 1}`
      }))
      .filter((entry) => Boolean(entry.label));
  };

  const getAddonSelectableItems = (addonId) => {
    if (addonId === 'product-spotlight') return buildSelectableTabItems('productsServices');
    if (addonId === 'case-study-showcase') return buildSelectableTabItems('caseStudies');
    if (addonId === 'completed-project-showcase') return buildSelectableTabItems('projects');
    if (addonId === 'innovations-showcase') return buildSelectableTabItems('innovation');
    if (addonId === 'industry-awards') return getAwardsByType('award').map((item, i) => ({ key: item?.id ? `id:${item.id}` : `idx:${i}`, index: i, item, label: item?.title || `Award ${i + 1}` }));
    if (addonId === 'hall-of-fame') return getAwardsByType('hallOfFame').map((item, i) => ({ key: item?.id ? `id:${item.id}` : `idx:${i}`, index: i, item, label: item?.title || `Entry ${i + 1}` }));
    return [];
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const getContentEntryIdentifier = (item, index = 0) => {
    return item?.id || item?._id || item?.title || item?.name || item?.awardTitle || item?.personName || `idx:${index}`;
  };

  const normalizeAwardImages = (item, maxImages = 3) => {
    const candidates = [
      item?.personImage,
      item?.image,
      ...(Array.isArray(item?.images) ? item.images : []),
      ...(Array.isArray(item?.photos) ? item.photos : []),
      ...(Array.isArray(item?.eventImages) ? item.eventImages : []),
    ].filter(Boolean);

    const unique = [];
    for (const img of candidates) {
      if (!unique.includes(img)) unique.push(img);
      if (unique.length >= maxImages) break;
    }
    return unique;
  };

  const resolveImageValue = async (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return readFileAsDataUrl(value);
  };

  const appendContentEntry = async (section, entry) => {
    const currentResponse = await fetch(`${API_BASE_URL}/content/${section}`);
    const currentData = await currentResponse.json();
    const currentList = Array.isArray(currentData?.data) ? currentData.data : [];
    const nextList = [...currentList, entry];

    const updateResponse = await fetch(`${API_BASE_URL}/content/${section}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextList),
    });

    const updateData = await updateResponse.json();
    if (!updateResponse.ok || !updateData?.success) {
      throw new Error(updateData?.error || updateData?.message || `Failed to update ${section}`);
    }
  };

  const updateContentEntry = async (section, itemId, nextEntry) => {
    const currentResponse = await fetch(`${API_BASE_URL}/content/${section}`);
    const currentData = await currentResponse.json();
    const currentList = Array.isArray(currentData?.data) ? currentData.data : [];

    let found = false;
    const updatedList = currentList.map((item, index) => {
      const currentId = getContentEntryIdentifier(item, index);
      if (!found && String(currentId) === String(itemId)) {
        found = true;
        return {
          ...item,
          ...nextEntry,
          id: item?.id || nextEntry?.id,
        };
      }
      return item;
    });

    if (!found) {
      throw new Error('Could not find the selected item to update');
    }

    const updateResponse = await fetch(`${API_BASE_URL}/content/${section}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedList),
    });

    const updateData = await updateResponse.json();
    if (!updateResponse.ok || !updateData?.success) {
      throw new Error(updateData?.error || updateData?.message || `Failed to update ${section}`);
    }
  };

  // ── Resolve company ID from canonical id fields ──
  const updateCompanyById = async (payload) => {
    const companyId = getCompanyId(companyData);

    if (!companyId) {
      throw new Error('Company profile not found. Please complete your company profile first.');
    }

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data?.success) {
      throw new Error(data?.message || 'Failed to update company');
    }
    return data.data;
  };

  const handleOpenModal = async (addonId) => {
    if (['additional-recruitment', 'additional-service'].includes(addonId)) {
      return;
    }
    
    setSelectedItem('');
    setModalFormData({
      name: '',
      companyName: companyData?.companyName || '',
      description: '',
      image: null,
      images: []
    });
    setEditingEntry(null);
    
    setInnovationFormData({
      companyName: companyData?.companyName || '',
      companyLogo: '',
      category: '',
      type: 'product',
      name: '',
      image: '',
      description: '',
      keyFeatures: ['', '', '', ''],
      link: '',
      status: 'Upcoming'
    });
    
    if (addonId === 'hall-of-fame') {
      try {
        const response = await fetch(`${API_BASE_URL}/content/hallOfFame`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const companyItems = items.filter(item => 
          item.companyName === companyData?.companyName || item.company === companyData?.companyName
        );
        setHallOfFameItems(companyItems);
      } catch (e) {
        console.error('Error fetching hall of fame:', e);
      }
    } else if (addonId === 'industry-awards') {
      try {
        const response = await fetch(`${API_BASE_URL}/content/awards`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const companyItems = items.filter(item => 
          item.companyName === companyData?.companyName || item.company === companyData?.companyName
        );
        setAwardsItems(companyItems);
      } catch (e) {
        console.error('Error fetching awards:', e);
      }
    } else if (addonId === 'case-study-showcase') {
      try {
        const response = await fetch(`${API_BASE_URL}/content/case-studies`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const companyItems = items.filter(item => 
          item.companyName === companyData?.companyName || item.company === companyData?.companyName
        );
        setCaseStudyItems(companyItems);
      } catch (e) {
        console.error('Error fetching case studies:', e);
      }
    } else if (addonId === 'completed-project-showcase') {
      try {
        const response = await fetch(`${API_BASE_URL}/content/showcase`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const companyItems = items.filter(item => 
          item.companyName === companyData?.companyName || item.company === companyData?.companyName
        );
        setShowcaseItems(companyItems);
      } catch (e) {
        console.error('Error fetching showcase:', e);
      }
    } else if (addonId === 'innovations-showcase') {
      try {
        const response = await fetch(`${API_BASE_URL}/content/innovations`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const companyItems = items.filter(item => 
          item.companyName === companyData?.companyName || item.company === companyData?.companyName
        );
        setInnovationsItems(companyItems);
      } catch (e) {
        console.error('Error fetching innovations:', e);
      }
    }
    
    const addon = addonServicesList.find(a => a.id === addonId);
    if (addon) {
      setActiveAddonModal(addon);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!activeAddonModal?.id) {
        throw new Error('No addon selected');
      }

      // ── FIXED: use getCompanyId() instead of companyData?.id ──
      const companyId = getCompanyId(companyData);
      if (!companyId) {
        throw new Error('Company profile not found. Please complete your company profile first.');
      }

      const addonId = activeAddonModal.id;
      const now = new Date().toISOString();

      if (addonId === 'company-spotlight') {
        await updateCompanyById({
          spotlight: {
            ...(companyData?.spotlight || {}),
            enabled: true,
            addedAt: now,
            removedAt: null,
            companyLogo: companyData?.companyLogo || null,
          },
        });
      } else if (addonId === 'product-spotlight') {
        const options = getAddonSelectableItems(addonId);
        const selectedOption = options.find((option) => option.key === selectedItem);
        if (!selectedOption) {
          throw new Error('Please select a product or service');
        }
        const currentItems = getCompanyTabItems('productsServices');
        const updatedItems = currentItems.map((item, index) => (
          index === selectedOption.index
            ? {
                ...item,
                spotlight: {
                  ...(item?.spotlight || {}),
                  enabled: true,
                  addedAt: now,
                  removedAt: null,
                },
              }
            : item
        ));

        await updateCompanyById({
          tabs: {
            ...(companyData?.tabs || {}),
            productsServices: {
              ...(companyData?.tabs?.productsServices || {}),
              enabled: true,
              items: updatedItems,
            },
          },
        });
      } else if (addonId === 'innovations-showcase') {
        if (!innovationFormData.name.trim()) {
          throw new Error('Please enter a product/service name');
        }
        if (!innovationFormData.category) {
          throw new Error('Please select a category');
        }
        if (!innovationFormData.description.trim()) {
          throw new Error('Please enter a description');
        }
        
        const innovationPayload = {
          id: `innovation-${Date.now()}`,
          name: innovationFormData.name.trim(),
          title: innovationFormData.name.trim(),
          description: innovationFormData.description.trim(),
          type: innovationFormData.type,
          category: innovationFormData.category,
          company: innovationFormData.companyName || companyData?.companyName || '',
          companyName: innovationFormData.companyName || companyData?.companyName || '',
          companyLogo: innovationFormData.companyLogo,
          image: innovationFormData.image,
          keyFeatures: innovationFormData.keyFeatures.filter(f => f.trim()),
          link: innovationFormData.link,
          status: innovationFormData.status,
          createdAt: now,
        };

        if (editingEntry?.section === 'innovations' && editingEntry?.itemId) {
          await updateContentEntry('innovations', editingEntry.itemId, {
            ...innovationPayload,
            updatedAt: now,
          });
        } else {
          await appendContentEntry('innovations', innovationPayload);
        }
      } else if (addonId === 'case-study-showcase' || addonId === 'completed-project-showcase') {
        const options = getAddonSelectableItems(addonId);
        const selectedOption = options.find((option) => option.key === selectedItem);
        if (!selectedOption) {
          throw new Error('Please select an item');
        }

        const item = selectedOption.item || {};
        if (addonId === 'case-study-showcase') {
          await appendContentEntry('case-studies', {
            id: item.id || `case-study-${Date.now()}`,
            title: item.title || item.name || 'Case Study',
            company: companyData?.companyName || '',
            companyName: companyData?.companyName || '',
            sector: companyData?.mainSector || '',
            location: companyData?.companyAddress || '',
            year: new Date().getFullYear(),
            overview: item.overview || item.description || '',
            description: item.description || item.overview || '',
            images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
          });
        }

        if (addonId === 'completed-project-showcase') {
          await appendContentEntry('showcase', {
            id: item.id || `project-${Date.now()}`,
            title: item.title || item.name || 'Completed Project',
            company: companyData?.companyName || '',
            companyName: companyData?.companyName || '',
            sector: companyData?.mainSector || '',
            location: item.location || companyData?.companyAddress || '',
            projectValue: item.value || '',
            completedDate: item.completion || String(new Date().getFullYear()),
            overview: item.overview || item.description || '',
            workDelivered: item.workDelivered || '',
            keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures.join('\n') : '',
            images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
          });
        }
      } else if (addonId === 'industry-awards') {
        if (!modalFormData.name.trim() || !modalFormData.companyName.trim() || !modalFormData.description.trim()) {
          throw new Error('Please fill all required fields');
        }

        const imageValues = Array.isArray(modalFormData.images) ? modalFormData.images.slice(0, 3) : [];
        if (imageValues.length > 3) {
          throw new Error('You can upload up to 3 images only');
        }

        const resolvedImages = (await Promise.all(imageValues.map(resolveImageValue))).filter(Boolean).slice(0, 3);
        const primaryImage = resolvedImages[0] || '';

        const awardPayload = {
          id: `industry-awards-${Date.now()}`,
          personName: modalFormData.name.trim(),
          awardTitle: modalFormData.name.trim(),
          awardDescription: modalFormData.description.trim(),
          companyName: modalFormData.companyName.trim(),
          awardYear: new Date().getFullYear(),
          personImage: primaryImage,
          image: primaryImage,
          images: resolvedImages,
          createdAt: now,
        };

        if (editingEntry?.section === 'awards' && editingEntry?.itemId) {
          await updateContentEntry('awards', editingEntry.itemId, {
            ...awardPayload,
            updatedAt: now,
          });
        } else {
          await appendContentEntry('awards', awardPayload);
        }
      } else if (addonId === 'hall-of-fame') {
        if (!modalFormData.name.trim() || !modalFormData.companyName.trim() || !modalFormData.description.trim()) {
          throw new Error('Please fill all required fields');
        }
        const imageData = modalFormData.image ? await resolveImageValue(modalFormData.image) : '';
        const hallPayload = {
          id: `hall-of-fame-${Date.now()}`,
          personName: modalFormData.name.trim(),
          awardTitle: 'Hall Of Fame',
          awardDescription: modalFormData.description.trim(),
          companyName: modalFormData.companyName.trim(),
          awardYear: new Date().getFullYear(),
          personImage: imageData,
          image: imageData,
          createdAt: now,
        };

        if (editingEntry?.section === 'hallOfFame' && editingEntry?.itemId) {
          await updateContentEntry('hallOfFame', editingEntry.itemId, {
            ...hallPayload,
            updatedAt: now,
          });
        } else {
          await appendContentEntry('hallOfFame', hallPayload);
        }
      }
      
      setSuccessMessage(editingEntry ? `Successfully updated: ${activeAddonModal.name}!` : `Successfully processed: ${activeAddonModal.name}!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      await fetchCompanySubscription();
      
      setEditingEntry(null);
      setActiveAddonModal(null);
    } catch (err) {
      setError(err.message || 'Failed to process request. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddonSelection = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const isAddonSelected = (addonId) => {
    return selectedAddons.includes(addonId);
  };

  const handlePurchaseMultipleAddons = async () => {
    if (selectedAddons.length === 0) {
      setError('Please select at least one addon to purchase');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      
      const addonsToPurchase = addonServicesList.filter(a => selectedAddons.includes(a.id));
      const totalPrice = addonsToPurchase.reduce((sum, addon) => sum + addon.price, 0);

      const response = await fetch(`${API_BASE_URL}/create-addon-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addons: selectedAddons.map(id => {
            const addon = addonServicesList.find(a => a.id === id);
            return {
              addonId: id,
              addonName: addon.name,
              price: addon.price
            };
          }),
          totalPrice: totalPrice,
          successUrl: window.location.origin + '/manage-subscriptions?payment=success',
          cancelUrl: window.location.origin + '/manage-subscriptions?payment=cancelled',
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        localStorage.setItem('lastAddonsPurchase', JSON.stringify(selectedAddons));
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'Failed to initiate payment');
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handlePurchaseAddon = async (addonId) => {
    try {
      setPurchasingAddon(addonId);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const addon = addonServicesList.find(a => a.id === addonId);
      
      localStorage.setItem('lastAddonPurchase', addonId);
      
      const response = await fetch(`${API_BASE_URL}/create-addon-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addonId: addonId,
          addonName: addon.name,
          price: addon.price,
          successUrl: window.location.origin + '/manage-subscriptions?payment=success',
          cancelUrl: window.location.origin + '/manage-subscriptions?payment=cancelled',
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        localStorage.removeItem('lastAddonPurchase');
        setError(data.message || 'Failed to initiate payment');
      }
    } catch (err) {
      localStorage.removeItem('lastAddonPurchase');
      setError(err.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setPurchasingAddon(null);
    }
  };

  const getAddonExpiryDate = (addonId) => {
    if (subscription?.addonDetails) {
      const addonDetail = subscription.addonDetails.find(a => a.id === addonId);
      if (addonDetail?.expiryDate) {
        return addonDetail.expiryDate;
      }
    }
    if (subscription?.endDate) {
      return subscription.endDate;
    }
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 30);
    return fallbackDate.toISOString();
  };

  const handlePurchaseAgain = async (addonId) => {
    setActiveAddonModal(null);
    await handlePurchaseAddon(addonId);
  };

  const isAddonExpired = (addonId) => {
    const expiryDate = getAddonExpiryDate(addonId);
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getSpotlightedProducts = () => {
    const items = companyData?.tabs?.productsServices?.items || [];
    return items.filter(item => item?.spotlight?.enabled);
  };

  const getSpotlightedCompany = () => {
    return companyData?.spotlight?.enabled ? companyData.spotlight : null;
  };

  // ── FIXED: use getCompanyId() in spotlight removal handlers ──
  const handleRemoveProductSpotlight = async (itemIndex) => {
    const companyId = getCompanyId(companyData);
    if (!companyId) return;
    setIsSubmitting(true);
    try {
      const currentItems = getCompanyTabItems('productsServices');
      const updatedItems = currentItems.map((item, index) => (
        index === itemIndex
          ? { ...item, spotlight: { enabled: false, removedAt: new Date().toISOString() } }
          : item
      ));

      await updateCompanyById({
        tabs: {
          ...(companyData?.tabs || {}),
          productsServices: {
            ...(companyData?.tabs?.productsServices || {}),
            enabled: true,
            items: updatedItems,
          },
        },
      });
      
      setSuccessMessage('Product removed from spotlight');
      await fetchCompanySubscription();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove from spotlight');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCompanySpotlight = async () => {
    const companyId = getCompanyId(companyData);
    if (!companyId) return;
    setIsSubmitting(true);
    try {
      await updateCompanyById({
        spotlight: {
          ...(companyData?.spotlight || {}),
          enabled: false,
          removedAt: new Date().toISOString(),
        },
      });
      
      setSuccessMessage('Company removed from spotlight');
      await fetchCompanySubscription();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove from spotlight');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveShowcaseItem = async (section, itemId) => {
    setIsSubmitting(true);
    try {
      const currentResponse = await fetch(`${API_BASE_URL}/content/${section}`);
      const currentData = await currentResponse.json();
      const currentList = Array.isArray(currentData?.data) ? currentData.data : [];
      
      const updatedList = currentList.filter((item, index) => {
        const itemIdToCheck = getContentEntryIdentifier(item, index);
        return String(itemIdToCheck) !== String(itemId);
      });

      const updateResponse = await fetch(`${API_BASE_URL}/content/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to remove showcase item');
      }
      
      setSuccessMessage('Item removed from showcase');
      if (editingEntry?.section === section && String(editingEntry?.itemId) === String(itemId)) {
        setEditingEntry(null);
      }
      
      if (section === 'case-studies') {
        const response = await fetch(`${API_BASE_URL}/content/case-studies`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setCaseStudyItems(items.filter(item => item.companyName === companyData?.companyName || item.company === companyData?.companyName));
      } else if (section === 'showcase') {
        const response = await fetch(`${API_BASE_URL}/content/showcase`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setShowcaseItems(items.filter(item => item.companyName === companyData?.companyName || item.company === companyData?.companyName));
      } else if (section === 'innovations') {
        const response = await fetch(`${API_BASE_URL}/content/innovations`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setInnovationsItems(items.filter(item => item.companyName === companyData?.companyName || item.company === companyData?.companyName));
      } else if (section === 'awards') {
        const response = await fetch(`${API_BASE_URL}/content/awards`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setAwardsItems(items.filter(item => item.companyName === companyData?.companyName || item.company === companyData?.companyName));
      } else if (section === 'hallOfFame') {
        const response = await fetch(`${API_BASE_URL}/content/hallOfFame`);
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setHallOfFameItems(items.filter(item => item.companyName === companyData?.companyName || item.company === companyData?.companyName));
      }
      
      await fetchCompanySubscription();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomDropdown = ({ value, onChange, options, placeholder, label, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between transition-all duration-200"
          style={{
            ...fieldStyle,
            cursor: "pointer",
            textAlign: "left",
            borderColor: isOpen ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.12)",
          }}
        >
          <span style={{ color: selectedOption ? "#ffffff" : "rgba(255,255,255,0.25)" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: "rgba(255,255,255,0.4)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="custom-scrollbar absolute left-0 right-0 rounded-xl border overflow-hidden max-h-60 overflow-y-auto"
              style={{
                top: "calc(100% + 8px)",
                zIndex: 9999,
                background: "rgba(4,12,30,0.97)",
                backdropFilter: "blur(32px)",
                borderColor: "rgba(255,255,255,0.12)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              {placeholder && (
                <button
                  type="button"
                  onClick={() => { onChange(""); setIsOpen(false); }}
                  className="w-full text-left px-5 py-3.5 border-b transition-all duration-150"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "rgba(255,255,255,0.4)",
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >
                  {placeholder}
                </button>
              )}
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className="w-full text-left px-5 py-3.5 border-b transition-all duration-150"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13.5px",
                    color: value === option.value ? "#10b981" : "rgba(255,255,255,0.75)",
                    borderColor: "rgba(255,255,255,0.06)",
                    background: value === option.value ? "rgba(16,185,129,0.12)" : "transparent",
                    fontWeight: value === option.value ? 500 : 400,
                  }}
                  onMouseEnter={(e) => { 
                    if (value !== option.value) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)"; 
                      e.currentTarget.style.color = "#fff"; 
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (value !== option.value) {
                      e.currentTarget.style.background = "transparent"; 
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)"; 
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderModalContent = () => {
    if (!activeAddonModal) return null;

    const id = activeAddonModal.id;
    const expiryDate = getAddonExpiryDate(id);

    const fieldLabelClass = "block text-xs uppercase tracking-[0.18em] mb-2";

    const renderModalFooter = () => (
      <div className="mt-6 pt-4 border-t border-white/10">
        {expiryDate && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-2xl border" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.28)" }}>
            <Calendar className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Expires on</p>
              <p className="text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{new Date(expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => handlePurchaseAgain(id)}
          disabled={purchasingAddon === id}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}
        >
          {purchasingAddon === id ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#041321]"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Purchase Again</span>
            </>
          )}
        </button>
      </div>
    );

    if (id === 'company-spotlight') {
      const spotlighted = getSpotlightedCompany();
      const expired = isAddonExpired(id);
      
      return (
        <div className="space-y-4">
          {spotlighted && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-300 mb-2">Currently in Spotlight</label>
              <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/30 flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{companyData?.companyName}</p>
                      <p className="text-green-300 text-sm">Added {new Date(spotlighted.addedAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCompanySpotlight}
                    disabled={isSubmitting}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    title="Remove from spotlight"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!expired ? (
            <>
              {!spotlighted && <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.62)" }}>You are about to add your company to the Spotlight.</p>}
              <button type="submit" disabled={isSubmitting || spotlighted} className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? 'Adding...' : (spotlighted ? 'Already in Spotlight' : 'Add to Spotlight')}
              </button>
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">Addon Expired</p>
              <p className="text-red-200 text-sm">Please purchase again to add new items.</p>
            </div>
          )}
          
          {renderModalFooter()}
        </div>
      );
    }

    if (id === 'product-spotlight') {
      const products = getAddonSelectableItems(id);
      const spotlightedProducts = getSpotlightedProducts();
      const expired = isAddonExpired(id);
      
      return (
        <div className="space-y-4">
          {spotlightedProducts.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-300 mb-2">Currently in Spotlight ({spotlightedProducts.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {spotlightedProducts.map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.title || item.name}</p>
                          <p className="text-green-300 text-xs">{item.type || 'Product'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProductSpotlight(idx)}
                        disabled={isSubmitting}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Remove from spotlight"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!expired ? (
            <>
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Select Product or Service to Add</label>
                <CustomDropdown
                  value={selectedItem}
                  onChange={setSelectedItem}
                  options={products.map(p => ({ value: p.key, label: p.label }))}
                  placeholder="Select a product/service..."
                  required
                />
                {products.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">No products/services found in your profile.</p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting || !selectedItem} className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? 'Adding...' : 'Add to Spotlight'}
              </button>
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">Addon Expired</p>
              <p className="text-red-200 text-sm">Please purchase again to add new items.</p>
            </div>
          )}
          
          {renderModalFooter()}
        </div>
      );
    }

    if (id === 'hall-of-fame' || id === 'industry-awards') {
      const isAward = id === 'industry-awards';
      const labelName = isAward ? 'Award Name' : 'Hero Name';
      const btnText = isAward ? 'Add to Industry Awards page' : 'Add to Industry Hero page';
      const section = isAward ? 'awards' : 'hallOfFame';
      const expired = isAddonExpired(id);
      const existingItems = isAward ? awardsItems : hallOfFameItems;

      return (
        <div className="space-y-4">
          {existingItems.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-300 mb-2">Currently Listed ({existingItems.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.awardTitle || item.personName || 'Award'}</p>
                          <p className="text-green-300 text-xs">{item.awardYear || new Date().getFullYear()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const itemId = getContentEntryIdentifier(item, idx);
                            if (isAward) {
                              setModalFormData({
                                name: item.awardTitle || item.personName || '',
                                companyName: item.companyName || item.company || companyData?.companyName || '',
                                description: item.awardDescription || item.description || '',
                                image: null,
                                images: normalizeAwardImages(item, 3),
                              });
                            } else {
                              setModalFormData({
                                name: item.personName || item.awardTitle || '',
                                companyName: item.companyName || item.company || companyData?.companyName || '',
                                description: item.awardDescription || item.description || '',
                                image: item.personImage || item.image || null,
                                images: [],
                              });
                            }
                            setEditingEntry({ section, itemId });
                          }}
                          disabled={isSubmitting}
                          className="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveShowcaseItem(section, getContentEntryIdentifier(item, idx))}
                          disabled={isSubmitting}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!expired ? (
            <>
              {isAward ? (
                <div>
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Upload Images (up to 3)</label>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer relative" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const validImages = files.filter((file) => file.type.startsWith('image/'));
                        const nextImages = [...(modalFormData.images || []), ...validImages].slice(0, 3);
                        setModalFormData({ ...modalFormData, images: nextImages });
                      }}
                      accept="image/*"
                      multiple
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="w-8 h-8" style={{ color: "#67e8f9" }} />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans', sans-serif" }}>
                        {modalFormData.images?.length ? `${modalFormData.images.length} image(s) selected` : 'Click to upload images'}
                      </span>
                    </div>
                  </div>
                  {modalFormData.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {modalFormData.images.map((img, imgIndex) => {
                        const src = typeof img === 'string' ? img : URL.createObjectURL(img);
                        return (
                          <div key={`${imgIndex}-${typeof img === 'string' ? 'url' : img?.name || 'file'}`} className="relative rounded-lg overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                            <img src={src} alt={`Award ${imgIndex + 1}`} className="w-full h-20 object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const nextImages = (modalFormData.images || []).filter((_, i) => i !== imgIndex);
                                setModalFormData({ ...modalFormData, images: nextImages });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Upload Image</label>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer relative" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setModalFormData({...modalFormData, image: e.target.files[0]})} accept="image/*" />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="w-8 h-8" style={{ color: "#67e8f9" }} />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans', sans-serif" }}>
                        {modalFormData.image ? (typeof modalFormData.image === 'string' ? 'Image selected' : modalFormData.image.name) : 'Click to upload image'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>{labelName}</label>
                <input type="text" value={modalFormData.name} onChange={(e) => setModalFormData({...modalFormData, name: e.target.value})} style={fieldStyle} placeholder={`Enter ${labelName.toLowerCase()}`} required />
              </div>
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Company Name</label>
                <input type="text" value={modalFormData.companyName} onChange={(e) => setModalFormData({...modalFormData, companyName: e.target.value})} style={fieldStyle} placeholder="Enter company name" required />
              </div>
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Description</label>
                <textarea value={modalFormData.description} onChange={(e) => setModalFormData({...modalFormData, description: e.target.value})} className="h-24 resize-none" style={fieldStyle} placeholder="Enter description" required />
              </div>
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Recruitment Company?</label>
                <div style={{ position: "relative" }}>
                  <select 
                    style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer", background: "rgba(4,14,30,0.88)", borderColor: "rgba(103,232,249,0.24)" }} 
                    value={modalFormData.isRecruitmentCompany} 
                    onChange={(e) => setModalFormData({...modalFormData, isRecruitmentCompany: e.target.value})} 
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? (editingEntry?.section === section ? 'Saving...' : 'Adding...') : (editingEntry?.section === section ? 'Save changes' : btnText)}
              </button>
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">Addon Expired</p>
              <p className="text-red-200 text-sm">Please purchase again to add new items.</p>
            </div>
          )}
          
          {renderModalFooter()}
        </div>
      );
    }

    if (id === 'case-study-showcase' || id === 'completed-project-showcase') {
      let items = getAddonSelectableItems(id);
      let label = '';
      let section = '';
      let existingItems = [];
      
      if (id === 'case-study-showcase') {
        label = 'Select Case Study';
        section = 'case-studies';
        existingItems = caseStudyItems;
      } else if (id === 'completed-project-showcase') {
        label = 'Select Completed Project';
        section = 'showcase';
        existingItems = showcaseItems;
      }
      
      const expired = isAddonExpired(id);

      return (
        <div className="space-y-4">
          {existingItems.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-300 mb-2">Currently Showcased ({existingItems.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.title || item.name}</p>
                          <p className="text-green-300 text-xs">{item.location || item.sector || 'Showcase'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveShowcaseItem(section, item.id || item.title)}
                        disabled={isSubmitting}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Remove from showcase"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!expired ? (
            <>
              <div>
                <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>{label} to Add</label>
                <CustomDropdown
                  value={selectedItem}
                  onChange={setSelectedItem}
                  options={items.map(item => ({ value: item.key, label: item.label }))}
                  placeholder="Select an option..."
                  required
                />
                {items.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">No items found in your profile.</p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting || !selectedItem} className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? 'Adding...' : 'Add to Showcase'}
              </button>
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">Addon Expired</p>
              <p className="text-red-200 text-sm">Please purchase again to add new items.</p>
            </div>
          )}
          
          {renderModalFooter()}
        </div>
      );
    }

    if (id === 'innovations-showcase') {
      const section = 'innovations';
      const existingItems = innovationsItems;
      const expired = isAddonExpired(id);

      return (
        <div className="space-y-4">
          {existingItems.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-300 mb-2">Currently Showcased ({existingItems.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.title || item.name}</p>
                          <p className="text-green-300 text-xs">{item.category || 'Innovation'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const itemId = getContentEntryIdentifier(item, idx);
                            setInnovationFormData({
                              companyName: item.companyName || item.company || companyData?.companyName || '',
                              companyLogo: item.companyLogo || '',
                              category: item.category || '',
                              type: item.type || 'product',
                              name: item.name || item.title || '',
                              image: item.image || (Array.isArray(item.images) ? item.images[0] : '') || '',
                              description: item.description || '',
                              keyFeatures: Array.isArray(item.keyFeatures) && item.keyFeatures.length > 0
                                ? [...item.keyFeatures.slice(0, 4), ...Array(Math.max(0, 4 - item.keyFeatures.length)).fill('')]
                                : ['', '', '', ''],
                              link: item.link || '',
                              status: item.status || 'Upcoming',
                            });
                            setEditingEntry({ section, itemId });
                          }}
                          disabled={isSubmitting}
                          className="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveShowcaseItem(section, getContentEntryIdentifier(item, idx))}
                          disabled={isSubmitting}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Remove from showcase"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!expired ? (
            <>
              <div className="space-y-4 pr-2">
                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Company Name</label>
                  <input type="text" id="innovation-company-name" name="companyName" value={innovationFormData.companyName} onChange={(e) => setInnovationFormData({...innovationFormData, companyName: e.target.value})} style={fieldStyle} placeholder="Enter company name" />
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Company Logo</label>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer relative overflow-hidden" style={{ borderColor: innovationFormData.companyLogo ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.15)", background: innovationFormData.companyLogo ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        alert('Please upload an image file');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setInnovationFormData((prev) => ({ ...prev, companyLogo: reader.result }));
                      reader.readAsDataURL(file);
                    }} accept="image/*" />
                    {innovationFormData.companyLogo ? (
                      <div className="relative">
                        <img src={innovationFormData.companyLogo} alt="logo" className="max-h-32 mx-auto rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setInnovationFormData((prev) => ({ ...prev, companyLogo: '' })); }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Upload className="w-8 h-8" style={{ color: "#67e8f9" }} />
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans', sans-serif" }}>Click to upload logo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Category</label>
                  <CustomDropdown
                    value={innovationFormData.category}
                    onChange={(value) => setInnovationFormData({...innovationFormData, category: value})}
                    options={[
                      { value: "renewable-energy", label: "Renewable Energy" },
                      { value: "sustainable", label: "Sustainable" },
                      { value: "environmental", label: "Environmental" },
                      { value: "energy-management", label: "Energy Management & Efficiency" },
                      { value: "ahead-of-curve", label: "Get Ahead Of The Curve" },
                      { value: "hot-off-press", label: "Hot Off The Press" },
                    ]}
                    placeholder="Select category"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Type</label>
                  <div className="flex gap-4">
                    {["product","service"].map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value={t} checked={innovationFormData.type === t} onChange={(e) => setInnovationFormData({...innovationFormData, type: e.target.value})} style={{ accentColor: "#10b981" }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", textTransform: "capitalize" }}>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>{innovationFormData.type === "product" ? "Product Name" : "Service Name"}</label>
                  <input type="text" id="innovation-name" name="name" value={innovationFormData.name} onChange={(e) => setInnovationFormData({...innovationFormData, name: e.target.value})} style={fieldStyle} placeholder={`Enter ${innovationFormData.type} name`} required />
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>{innovationFormData.type === "product" ? "Product Image" : "Service Image"}</label>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer relative overflow-hidden" style={{ borderColor: innovationFormData.image ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.15)", background: innovationFormData.image ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        alert('Please upload an image file');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setInnovationFormData((prev) => ({ ...prev, image: reader.result }));
                      reader.readAsDataURL(file);
                    }} accept="image/*" />
                    {innovationFormData.image ? (
                      <div className="relative">
                        <img src={innovationFormData.image} alt="image" className="max-h-32 mx-auto rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setInnovationFormData((prev) => ({ ...prev, image: '' })); }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Upload className="w-8 h-8" style={{ color: "#67e8f9" }} />
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans', sans-serif" }}>Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Description</label>
                  <textarea id="innovation-description" name="description" value={innovationFormData.description} onChange={(e) => setInnovationFormData({...innovationFormData, description: e.target.value})} className="h-24 resize-none" style={fieldStyle} placeholder={`Describe the ${innovationFormData.type}...`} required />
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Key Features</label>
                  <div className="space-y-2">
                    {innovationFormData.keyFeatures.map((f, i) => (
                      <input key={i} type="text" value={f} onChange={(e) => { const kf = [...innovationFormData.keyFeatures]; kf[i] = e.target.value; setInnovationFormData({...innovationFormData, keyFeatures: kf}); }} style={fieldStyle} placeholder={`Key feature ${i + 1}`} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Status</label>
                    <CustomDropdown
                      value={innovationFormData.status}
                      onChange={(value) => setInnovationFormData({...innovationFormData, status: value})}
                      options={[
                        { value: "Upcoming", label: "Upcoming" },
                        { value: "In Development", label: "In Development" },
                        { value: "Launched", label: "Launched" },
                        { value: "Pilot", label: "Pilot" },
                      ]}
                      placeholder="Select status"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabelClass} style={{ color: "#67e8f9", fontFamily: "'DM Sans', sans-serif" }}>Link</label>
                    <input type="url" id="innovation-link" name="link" value={innovationFormData.link} onChange={(e) => setInnovationFormData({...innovationFormData, link: e.target.value})} style={fieldStyle} placeholder="https://example.com" />
                  </div>
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting || !innovationFormData.name.trim() || !innovationFormData.category || !innovationFormData.description.trim()} className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? (editingEntry?.section === section ? 'Saving...' : 'Adding...') : (editingEntry?.section === section ? 'Save changes' : 'Add Innovation to Showcase')}
              </button>
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">Addon Expired</p>
              <p className="text-red-200 text-sm">Please purchase again to add new items.</p>
            </div>
          )}
          
          {renderModalFooter()}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: "#040e1e" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/15 border-t-emerald-400 mx-auto mb-4"></div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)" }}>Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden pt-28" style={{ background: "#040e1e" }}>
      <ScrollingBanner />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        
        /* Custom scrollbar for modal popup - matches dark theme */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,0.4);
          border-radius: 4px;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,0.6);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(16,185,129,0.4) rgba(255,255,255,0.05);
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[520px] h-[520px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="rounded-3xl border overflow-hidden mb-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
          <div className="relative h-[250px] md:h-[320px]">
            <img src="/Contact Us/subscription.jpeg" alt="Manage subscription" className="w-full h-full object-cover" style={{ filter: "brightness(0.38) saturate(1.2)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.35) 0%, rgba(4,14,30,0.65) 65%, rgba(4,14,30,0.9) 100%)" }} />
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
              <div className="flex items-center justify-between gap-4 mb-4">
                <motion.button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all" style={{ borderColor: "rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif" }} whileHover={{ x: -4 }}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </motion.button>
                <motion.button onClick={fetchCompanySubscription} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all disabled:opacity-60" style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }} whileHover={{ scale: 1.03 }}>
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </motion.button>
              </div>
              <h1 className="hero-text-mask mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.25 }}>Manage Subscription &amp; Add-ons</h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.58)", maxWidth: "560px" }}>Control your plan, configure purchased addons, and publish spotlight items with the same visual language used across Home and About.</p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 p-4 rounded-2xl border" style={{ background: "rgba(16,185,129,0.14)", borderColor: "rgba(16,185,129,0.3)" }}>
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-300" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{successMessage}</span>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 p-4 rounded-2xl border" style={{ background: "rgba(239,68,68,0.16)", borderColor: "rgba(248,113,113,0.4)" }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-300" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</span>
            </motion.div>
          )}

          {subscription && subscription.plan ? (
            <div className="space-y-8 pb-10">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border p-7 md:p-8" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.02)", boxShadow: "0 15px 40px rgba(0,0,0,0.35)" }}>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))" }}>
                    {getPlanIcon(subscription.plan)}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.4vw, 2rem)", lineHeight: 1.2 }}>Current Subscription</h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}>Your active membership details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl p-5 border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#10b981" }}>Active Plan</p>
                      {(() => {
                        const upgradeInfo = getUpgradeInfo();
                        if (!upgradeInfo.canUpgrade) return null;
                        return (
                          <motion.button
                            onClick={() => navigate(upgradeInfo.targetPlan ? `/subscription-plans?plan=${upgradeInfo.targetPlan}` : '/subscription-plans')}
                            className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                            style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {upgradeInfo.buttonText}
                          </motion.button>
                        );
                      })()}
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{getPlanName(subscription.plan)}</p>
                  </div>
                  <div className="rounded-2xl p-5 border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#10b981", marginBottom: "8px" }}>Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${subscription.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }} className="capitalize">{subscription.status || 'Active'}</p>
                    </div>
                  </div>
                  {(subscription.startDate || subscription.endDate) && (
                    <div className="rounded-2xl p-5 border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#10b981", marginBottom: "8px" }}>End Date</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border p-7 md:p-8" style={{ borderColor: "rgba(16,185,129,0.35)", background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(4,14,30,0.75))" }}>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.18)" }}>
                    <CheckCircle className="w-7 h-7 text-emerald-300" />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.45rem, 2.3vw, 1.9rem)" }}>Purchased Addons</h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.58)" }}>Configure every purchased addon from one place</p>
                  </div>
                </div>

                {(!subscription.addons || subscription.addons.length === 0) ? (
                  <div className="text-center py-9 rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                    <Package className="w-10 h-10 mx-auto mb-3 text-emerald-300/70" />
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>No addons purchased yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addonServicesList.filter((a) => subscription.addons.includes(a.id)).map((addon, index) => {
                      const isClickable = !['additional-recruitment', 'additional-service'].includes(addon.id);
                      return (
                        <motion.div key={addon.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.05 }} onClick={() => isClickable && handleOpenModal(addon.id)} className={`h-full rounded-2xl border p-5 transition-all flex flex-col ${isClickable ? 'cursor-pointer hover:scale-[1.015]' : ''}`} style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(255,255,255,0.03)" }}>
                          <div className="flex items-start gap-3 mb-3 flex-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)" }}>
                              <CheckCircle className="w-5 h-5 text-emerald-300" />
                            </div>
                            <div className="flex-1">
                              <p style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>{addon.name}</p>
                              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#34d399", marginTop: "6px" }}>Active</p>
                            </div>
                          </div>
                          <div className="rounded-xl px-3 py-2 mt-auto text-center flex items-center justify-center" style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.12)" }}>
                            <p className="w-full text-center" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.82)" }}>{isClickable ? "Manage add-on" : "No extra configuration required"}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border p-7 md:p-8" style={{ borderColor: "rgba(6,182,212,0.35)", background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(4,14,30,0.75))" }}>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(6,182,212,0.2)" }}>
                    <ShoppingCart className="w-7 h-7 text-cyan-300" />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.45rem, 2.3vw, 1.9rem)" }}>Available Addons</h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.58)" }}>Buy additional exposure and premium showcase slots{selectedAddons.length > 0 && ` - ${selectedAddons.length} selected`}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addonServicesList.filter((a) => !subscription.addons?.includes(a.id)).map((addon, index) => (
                    <motion.div key={addon.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.05 }} className="h-full rounded-2xl border p-5 cursor-pointer transition-all flex flex-col" style={{ borderColor: isAddonSelected(addon.id) ? "rgba(6,182,212,0.6)" : "rgba(255,255,255,0.08)", background: isAddonSelected(addon.id) ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.03)" }} onClick={() => toggleAddonSelection(addon.id)}>
                      <div className="flex items-start gap-3 mb-4 flex-1">
                        <input type="checkbox" checked={isAddonSelected(addon.id)} onChange={() => toggleAddonSelection(addon.id)} onClick={(e) => e.stopPropagation()} className="w-5 h-5 mt-0.5 cursor-pointer" style={{ accentColor: "#06b6d4" }} />
                        <div className="flex-1">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(6,182,212,0.2)" }}>
                            <Star className="w-5 h-5 text-cyan-300" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>{addon.name}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#67e8f9", marginTop: "5px" }}>£{addon.price}/month</p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <motion.button onClick={(e) => { e.stopPropagation(); handlePurchaseAddon(addon.id); }} disabled={purchasingAddon === addon.id} className="flex-1 py-2 rounded-xl font-medium transition-all disabled:opacity-50 text-sm flex items-center justify-center text-center" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          {purchasingAddon === addon.id ? 'Buying...' : 'Buy'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}

                  {addonServicesList.filter((a) => !subscription.addons?.includes(a.id)).length === 0 && (
                    <div className="col-span-full text-center py-10 rounded-2xl border" style={{ borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.1)" }}>
                      <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>All addons unlocked</p>
                    </div>
                  )}
                </div>

                {selectedAddons.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl border" style={{ borderColor: "rgba(6,182,212,0.5)", background: "rgba(6,182,212,0.1)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Selected Addons: {selectedAddons.length}</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginTop: "4px" }}>Total: £{addonServicesList.filter(a => selectedAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0)}/month</p>
                      </div>
                    </div>
                    <motion.button onClick={handlePurchaseMultipleAddons} disabled={purchasingAddon !== null} className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50" style={{ background: "linear-gradient(90deg, #06b6d4, #0891b2)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {purchasingAddon ? 'Processing...' : `Purchase ${selectedAddons.length} Addon${selectedAddons.length > 1 ? 's' : ''}`}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border p-10 text-center mb-10" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <CreditCard className="w-10 h-10 text-emerald-300" />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", marginBottom: "10px" }}>No Active Subscription</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.58)", maxWidth: "620px", margin: "0 auto 28px" }}>You do not currently have a recorded subscription plan. Upgrade to unlock premium platform features and showcase slots.</p>
              <motion.button onClick={() => navigate('/profile-completion')} className="px-10 py-3 rounded-full font-semibold" style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", color: "#041321", fontFamily: "'DM Sans', sans-serif" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                View Plans
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeAddonModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6" style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(8px)" }}>
            <div ref={modalContentRef} onScroll={(e) => { scrollPositionRef.current = e.currentTarget.scrollTop; }} className="custom-scrollbar w-full max-w-2xl rounded-[34px] border p-7 md:p-8 relative max-h-[90vh] overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.12)", background: "linear-gradient(165deg, rgba(10,22,40,0.98), rgba(4,14,30,0.98))", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", scrollBehavior: 'auto' }}>
              <button onClick={() => setActiveAddonModal(null)} className="absolute top-5 right-5 p-2 rounded-full transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                <X className="w-5 h-5 text-white/80" />
              </button>
              <div className="mb-7 pr-10">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#10b981", fontWeight: 600 }}>Configuration</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", marginTop: "8px", lineHeight: 1.2 }}>{activeAddonModal.name}</h3>
              </div>
              <form onSubmit={handleModalSubmit}>
                {renderModalContent()}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSubscriptionsPage;
