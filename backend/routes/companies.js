import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createCompany, findCompanyById, findCompanyByUserId, updateCompany, getAllCompanies, deleteCompany, createUser, findUserByEmail, addAuditLog, getContent, updateContent } from '../database/db.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { sendSubscriptionPurchaseConfirmationEmail } from '../utils/emailService.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sectorsMapping = {
  Construction: {
    subsectors: [
      'Solar',
      'Wind',
      'Hydro',
      'Geothermal',
      'Biomass',
      'Energy Storage',
      'Grid Infrastructure',
      'EV Charging',
      'Heat Pumps',
      'Hydrogen'
    ]
  },
  Industrial: {
    subsectors: [
      'Manufacturing',
      'Oil & Gas',
      'Mining',
      'Steel',
      'Cement',
      'Chemicals',
      'Waste Management',
      'Water Treatment',
      'Carbon Capture',
      'Industrial Automation'
    ]
  },
  Agriculture: {
    subsectors: [
      'Farming Equipment',
      'Irrigation',
      'Sustainable Farming',
      'AgriTech',
      'Greenhouses',
      'Livestock Management',
      'Soil Management',
      'Crop Monitoring',
      'Bioenergy',
      'Aquaculture'
    ]
  },
  Domestic: {
    subsectors: [
      'Home Solar',
      'Home Battery Storage',
      'Insulation',
      'Smart Home Energy',
      'Home EV Charging',
      'Domestic Heat Pumps',
      'Energy Efficiency',
      'Home Wind',
      'Boilers',
      'Home Retrofits'
    ]
  }
};

const getMainSectorFromSubsector = (subsector) => {
  if (!subsector) return null;
  for (const [mainSector, data] of Object.entries(sectorsMapping)) {
    if (Array.isArray(data?.subsectors) && data.subsectors.includes(subsector)) {
      return mainSector;
    }
  }
  return null;
};

const normalizeMainSector = (candidateMainSector, industrySector) => {
  if (candidateMainSector) return candidateMainSector;
  if (!Array.isArray(industrySector) || industrySector.length === 0) return null;
  return (
    getMainSectorFromSubsector(industrySector[0]) ||
    industrySector.map(getMainSectorFromSubsector).find(Boolean) ||
    null
  );
};

const isValidHttpUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return isValidHttpUrl(withProtocol) ? withProtocol : '';
};

const sanitizeSocialMediaLinks = (input) => {
  if (!input) return {};

  let raw = input;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return {};
    try {
      raw = JSON.parse(trimmed);
    } catch {
      const splitLinks = trimmed
        .split(',')
        .map((part) => normalizeUrl(part))
        .filter(Boolean);
      return splitLinks.reduce((acc, link, idx) => {
        acc[`link${idx + 1}`] = link;
        return acc;
      }, {});
    }
  }

  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizeUrl(item))
      .filter(Boolean)
      .reduce((acc, link, idx) => {
        acc[`link${idx + 1}`] = link;
        return acc;
      }, {});
  }

  if (typeof raw === 'object') {
    return Object.entries(raw).reduce((acc, [key, value]) => {
      const normalized = normalizeUrl(value);
      if (normalized) acc[key] = normalized;
      return acc;
    }, {});
  }

  return {};
};

const resolveItemCompanyName = (companyRecord, explicitName) => {
  const trimmedName = typeof explicitName === 'string' ? explicitName.trim() : '';
  return trimmedName || companyRecord?.companyName || '';
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const formatCompanyForApi = (company) => {
  if (!company) return null;
  const plain = typeof company?.toObject === 'function' ? company.toObject() : { ...company };
  const id = plain?._id?.toString?.() || company?._id?.toString?.() || (plain?.id ? String(plain.id) : null);
  const { _id, __v, ...rest } = plain;
  return {
    ...rest,
    id
  };
};

const isInvalidObjectIdError = (error) => error?.code === 'INVALID_OBJECT_ID' || error?.status === 400;

const stripMongoInternalFields = (value, depth = 0) => {
  if (depth > 10) return value;
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  if (value && typeof value.toObject === 'function') return stripMongoInternalFields(value.toObject(), depth + 1);
  if (Array.isArray(value) || (value && value.constructor && value.constructor.name === 'Array')) {
    return Array.from(value).map(v => stripMongoInternalFields(v, depth + 1));
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    Object.entries(value).forEach(([key, v]) => {
      if (key === '_id' || key === '__v') return;
      out[key] = stripMongoInternalFields(v, depth + 1);
    });
    return out;
  }
  return value;
};

router.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (payload) => originalJson(stripMongoInternalFields(payload));
  next();
});

const validateCompanyIdParam = (req, res, next) => {
  const staticRoutePrefixes = new Set([
    'spotlight',
    'spotlight-products-services',
    'my-company',
    'onboard',
    'admin-onboard',
    'by-category',
    'by-hierarchical-category',
    'by-categories',
    'products-services'
  ]);
  if (staticRoutePrefixes.has(req.params.id)) return next();

  const isPublicCompanyBySlugRoute = req.method === 'GET' && (req.path === '/' || req.path === '');
  if (isPublicCompanyBySlugRoute) return next();

  const companyId = String(req.params.id || '').trim();
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid company ID'
    });
  }

  req.params.id = companyId;
  next();
};

router.use('/:id', validateCompanyIdParam);

// Companies in Spotlight (admin-managed list)
router.get('/spotlight', async (req, res) => {
  try {
    const companies = await getAllCompanies();
    // Filter out archived companies
    const activeCompanies = companies.filter(c => (c.status || 'Active') !== 'Archived');
    const spotlight = activeCompanies.filter((c) => c?.spotlight?.enabled);

    const publicCompanies = spotlight.map((company) => ({
      id: company._id?.toString(),
      slug: company.slug,
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      postCode: company.postCode,
      industrySector: company.industrySector,
      mainSector: company.mainSector || null,
      companyLogo: company.companyLogo,
      productsServiceCategories: company.productsServiceCategories || [],
      hierarchicalProductsServices: company.hierarchicalProductsServices || {},
      productsServices: company.productsServices,
      companyBio: company.companyBio || null,
      companyNews: company.companyNews || [],
      isRecruitmentCompany: company.isRecruitmentCompany,
      regions: company.regions,
      contactPerson: {
        firstName: company.contactPerson?.firstName,
        lastName: company.contactPerson?.lastName,
        role: company.contactPerson?.role,
        email: company.contactPerson?.email,
        phoneNumber: company.contactPerson?.phoneNumber,
      },
      spotlight: company.spotlight,
      createdAt: company.createdAt,
    }));

    return res.json({ success: true, data: publicCompanies });
  } catch (error) {
    console.error('Error fetching spotlight companies:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Products/Services in Spotlight (admin-managed list)
router.get('/spotlight-products-services', async (req, res) => {
  try {
    const companies = await getAllCompanies();
    // Filter out archived companies
    const activeCompanies = companies.filter(c => (c.status || 'Active') !== 'Archived');

    const spotlightItems = activeCompanies.flatMap((company) => {
      const items = company?.tabs?.productsServices?.items;
      if (!Array.isArray(items)) return [];

      return items
        .filter((item) => item?.spotlight?.enabled)
        .map((item) => ({
          id: company._id?.toString(),
          companyId: company._id?.toString(),
          companyName: company.companyName,
          companyLogo: company.companyLogo,
          companyAddress: company.companyAddress,
          mainSector: company.mainSector || null,
          item: {
            ...item,
          },
        }));
    });

    return res.json({ success: true, data: spotlightItems });
  } catch (error) {
    console.error('Error fetching spotlight product/service items:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/:id/products-services/:itemId/spotlight', verifyToken, requireAdmin, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const items = company?.tabs?.productsServices?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(404).json({ success: false, message: 'No product/service items found for this company' });
    }

    const idx = items.findIndex((i) => i?.id === req.params.itemId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product/service item not found' });
    }

    const spotlightPayload = {
      enabled: true,
      addedAt: new Date().toISOString(),
    };

    const updatedItems = items.map((it, i) => {
      if (i !== idx) return it;
      return {
        ...it,
        spotlight: {
          ...(it.spotlight || {}),
          ...spotlightPayload,
        },
      };
    });

    const updatedTabs = {
      ...(company.tabs || {}),
      productsServices: {
        ...(company.tabs?.productsServices || {}),
        items: updatedItems,
        enabled: true,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });

    return res.json({ success: true, data: spotlightPayload });
  } catch (error) {
    console.error('Error adding product/service item to spotlight:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id/products-services/:itemId/spotlight', verifyToken, requireAdmin, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const items = company?.tabs?.productsServices?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(404).json({ success: false, message: 'No product/service items found for this company' });
    }

    const idx = items.findIndex((i) => i?.id === req.params.itemId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product/service item not found' });
    }

    const spotlightPayload = {
      enabled: false,
      removedAt: new Date().toISOString(),
    };

    const updatedItems = items.map((it, i) => {
      if (i !== idx) return it;
      return {
        ...it,
        spotlight: {
          ...(it.spotlight || {}),
          ...spotlightPayload,
        },
      };
    });

    const updatedTabs = {
      ...(company.tabs || {}),
      productsServices: {
        ...(company.tabs?.productsServices || {}),
        items: updatedItems,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });

    return res.json({ success: true, data: spotlightPayload });
  } catch (error) {
    console.error('Error removing product/service item from spotlight:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/:id/spotlight', verifyToken, requireAdmin, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const spotlightPayload = {
      enabled: true,
      addedAt: new Date().toISOString(),
    };

    const updated = await updateCompany(req.params.id, {
      spotlight: {
        ...(company.spotlight || {}),
        ...spotlightPayload,
      },
    });

    return res.json({ success: true, data: updated?.spotlight || spotlightPayload });
  } catch (error) {
    console.error('Error adding company to spotlight:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id/spotlight', verifyToken, requireAdmin, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const updated = await updateCompany(req.params.id, {
      spotlight: {
        ...(company.spotlight || {}),
        enabled: false,
        removedAt: new Date().toISOString(),
      },
    });

    return res.json({ success: true, data: updated?.spotlight || { enabled: false } });
  } catch (error) {
    console.error('Error removing company from spotlight:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const getPlanLimits = (plan) => {
  if ((typeof plan === 'string' ? plan : plan?.name || '').toLowerCase() === 'elite') {
    return { maxItems: 6, maxImagesPerItem: 6 };
  }
  return { maxItems: 3, maxImagesPerItem: 3 };
};

const getProjectLimits = (plan) => {
  if ((typeof plan === 'string' ? plan : plan?.name || '').toLowerCase() === 'elite') {
    return { maxItems: 6, maxWords: 600, maxImagesPerItem: 6 };
  }
  return { maxItems: 3, maxWords: 300, maxImagesPerItem: 3 };
};

const canUseProjectVisibilityControl = (plan) => {
  const normalized = (typeof plan === 'string' ? plan : plan?.name || '').toLowerCase();
  return normalized === 'elite' || normalized === 'premium';
};

const getAwardLimits = (plan) => {
  if ((typeof plan === 'string' ? plan : plan?.name || '').toLowerCase() === 'elite') {
    return { maxItems: 6, maxWords: 600, maxImagesPerItem: 6 };
  }
  return { maxItems: 3, maxWords: 300, maxImagesPerItem: 3 };
};

const getCaseStudyLimits = (plan) => {
  if ((typeof plan === 'string' ? plan : plan?.name || '').toLowerCase() === 'elite') {
    return { maxItems: 6, maxImagesPerItem: 6, maxWords: 600 };
  }
  return { maxItems: 3, maxImagesPerItem: 3, maxWords: 300 };
};

router.post('/:id/case-studies', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      client,
      location,
      year,
      overview,
      keyFeatures,
      challenges,
      solution,
      outcome,
      url
    } = req.body;

    if (!title || !client || !location || !overview) {
      return res.status(400).json({
        success: false,
        message: 'Title, client, location, and overview are required'
      });
    }

    const plan = company.subscription?.plan || 'premium';
    const { maxItems, maxImagesPerItem, maxWords } = getCaseStudyLimits(plan);

    if (!company.tabs) company.tabs = {};
    if (!company.tabs.caseStudies) {
      company.tabs.caseStudies = { enabled: false, items: [] };
    }

    const currentItems = company.tabs.caseStudies.items || [];
    if (currentItems.length >= maxItems) {
      return res.status(400).json({
        success: false,
        message: `Plan limit reached. ${plan} plan allows up to ${maxItems} case studies.`
      });
    }

    const words = overview.trim().split(/\s+/).filter(Boolean).length;
    if (words > maxWords) {
      return res.status(400).json({
        success: false,
        message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
      });
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    if (uploadedImages.length > maxImagesPerItem) {
        return res.status(400).json({
          success: false,
          message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per case study.`
        });
    }

    let parsedKeyFeatures = [];
    if (keyFeatures) {
      try {
        parsedKeyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
      } catch (e) {
        parsedKeyFeatures = [];
      }
    }

    const newStudy = {
      id: Date.now().toString(),
      title,
      client,
      location,
      year: year || '',
      overview,
      keyFeatures: Array.isArray(parsedKeyFeatures) ? parsedKeyFeatures.filter(Boolean) : [],
      challenges: challenges || '',
      solution: solution || '',
      outcome: outcome || '',
      url: url || '',
      images: uploadedImages,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    company.tabs.caseStudies.items = [...currentItems, newStudy];
    company.tabs.caseStudies.enabled = true;

    await updateCompany(req.params.id, { tabs: company.tabs });
    await addAuditLog({
      action: 'case_study.create',
      companyId: company.id,
      userId: req.user.userId,
      itemId: newStudy.id,
      metadata: { title: newStudy.title }
    });

    return res.status(201).json({
      success: true,
      message: 'Case study added successfully',
      data: newStudy
    });
  } catch (error) {
    console.error('Error adding case study:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id/case-studies/:itemId', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.caseStudies?.items || [];
    const itemIndex = items.findIndex((i) => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    const {
      title,
      client,
      location,
      year,
      overview,
      keyFeatures,
      challenges,
      solution,
      outcome,
      url
    } = req.body;

    const plan = company.subscription?.plan || 'premium';
    const { maxImagesPerItem, maxWords } = getCaseStudyLimits(plan);

    if (overview) {
        const words = overview.trim().split(/\s+/).filter(Boolean).length;
        if (words > maxWords) {
            return res.status(400).json({
                success: false,
                message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
            });
        }
    }

    // Handle images
    let currentImages = items[itemIndex].images || [];
    let keptImages = [];
    if (req.body.existingImages) {
        try {
            keptImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : JSON.parse(req.body.existingImages);
        } catch (e) {
            keptImages = [];
        }
    } else if (req.body.existingImages === undefined) {
         keptImages = currentImages;
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const finalImages = [...keptImages, ...uploadedImages];

    if (finalImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per case study.`
      });
    }

    let parsedKeyFeatures = items[itemIndex].keyFeatures || [];
    if (keyFeatures !== undefined) {
      try {
        parsedKeyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
      } catch (e) {
        parsedKeyFeatures = [];
      }
    }

    const updatedStudy = {
      ...items[itemIndex],
      title: title || items[itemIndex].title,
      client: client || items[itemIndex].client,
      location: location || items[itemIndex].location,
      year: year || items[itemIndex].year,
      overview: overview || items[itemIndex].overview,
      keyFeatures: Array.isArray(parsedKeyFeatures) ? parsedKeyFeatures.filter(Boolean) : [],
      challenges: challenges !== undefined ? challenges : items[itemIndex].challenges,
      solution: solution !== undefined ? solution : items[itemIndex].solution,
      outcome: outcome !== undefined ? outcome : items[itemIndex].outcome,
      url: url !== undefined ? url : items[itemIndex].url,
      images: finalImages,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[itemIndex] = updatedStudy;

    const updatedTabs = {
      ...(company.tabs || {}),
      caseStudies: {
        ...(company.tabs?.caseStudies || {}),
        items: updatedItems,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
        action: 'case_study.update',
        companyId: company.id,
        userId: req.user.userId,
        itemId: updatedStudy.id,
        metadata: { title: updatedStudy.title }
    });

    return res.json({
      success: true,
      message: 'Case study updated successfully',
      data: updatedStudy
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.patch('/:id/case-studies/:itemId/archive', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.caseStudies?.items || [];
    const itemIndex = items.findIndex((i) => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    const archived = Boolean(req.body?.archived);
    const status = archived ? 'archived' : 'active';

    const updatedStudy = {
      ...items[itemIndex],
      status,
      archivedAt: archived ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[itemIndex] = updatedStudy;

    const updatedTabs = {
      ...(company.tabs || {}),
      caseStudies: {
        ...(company.tabs?.caseStudies || {}),
        items: updatedItems,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
        action: archived ? 'case_study.archive' : 'case_study.restore',
        companyId: company.id,
        userId: req.user.userId,
        itemId: updatedStudy.id,
        metadata: { title: updatedStudy.title }
    });

    return res.json({
      success: true,
      message: archived ? 'Case study archived successfully' : 'Case study restored successfully',
      data: updatedStudy
    });
  } catch (error) {
    console.error('Error archiving case study:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id/case-studies/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.caseStudies?.items || [];
    const exists = items.some((i) => i.id === req.params.itemId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    const updatedItems = items.filter((i) => i.id !== req.params.itemId);

    const updatedTabs = {
      ...(company.tabs || {}),
      caseStudies: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: 'case_study.delete',
      companyId: company.id,
      userId: req.user.userId,
      itemId: req.params.itemId
    });

    return res.json({
      success: true,
      message: 'Case study deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case study:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post(
  '/:id/products-services',
  verifyToken,
  upload.array('images', 6),
  async (req, res) => {
    try {
      const currentCompany = await findCompanyById(req.params.id);

      if (!currentCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      if (currentCompany.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const { type, title, description, features, sector, subsector, serviceCategory, companyName, company: companyValue, companyId } = req.body;

      if (!type || !['product', 'service'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be "product" or "service"'
        });
      }

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const plan = currentCompany.subscription?.plan || 'premium';
      const { maxItems, maxImagesPerItem } = getPlanLimits(plan);

      if (!currentCompany.tabs) currentCompany.tabs = {};
      if (!currentCompany.tabs.productsServices) {
        currentCompany.tabs.productsServices = { enabled: false, items: [] };
      }

      const currentItems = currentCompany.tabs.productsServices.items || [];
      if (currentItems.length >= maxItems) {
        return res.status(400).json({
          success: false,
          message: `Plan limit reached. ${plan} plan allows up to ${maxItems} products/services.`
        });
      }

      const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
      if (uploadedImages.length > maxImagesPerItem) {
        return res.status(400).json({
          success: false,
          message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per product/service.`
        });
      }

      let parsedFeatures = [];
      if (features) {
        try {
          parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
        } catch (e) {
          parsedFeatures = [];
        }
      }

      const newItem = {
        id: Date.now().toString(),
        type,
        title,
        description,
        features: Array.isArray(parsedFeatures) ? parsedFeatures.filter(Boolean) : [],
        sector: sector || '',
        subsector: subsector || '',
        serviceCategory: serviceCategory || '',
        companyName: resolveItemCompanyName(currentCompany, companyName || companyValue),
        company: resolveItemCompanyName(currentCompany, companyName || companyValue),
        companyId: companyId || req.params.id,
        images: uploadedImages,
        createdAt: new Date().toISOString()
      };

      currentCompany.tabs.productsServices.items = [...currentItems, newItem];
      currentCompany.tabs.productsServices.enabled = true;

      await updateCompany(req.params.id, { tabs: currentCompany.tabs });

      return res.status(201).json({
        success: true,
        message: 'Product/service added successfully',
        data: newItem
      });
    } catch (error) {
      console.error('Error adding product/service:', error);
      return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id/products-services/:itemId', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const currentCompany = await findCompanyById(req.params.id);

    if (!currentCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (currentCompany.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = currentCompany.tabs?.productsServices?.items || [];
    const itemIndex = items.findIndex((i) => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product/service not found'
      });
    }

    const { type, title, description, features, sector, subsector, serviceCategory, companyName, company: companyValue, companyId } = req.body;

    const plan = currentCompany.subscription?.plan || 'premium';
    const { maxImagesPerItem } = getPlanLimits(plan);

    // Handle images
    let currentImages = items[itemIndex].images || [];
    // If existing images are sent as a string (JSON) or array, parse/use them
    // Note: This logic depends on how frontend sends existing images. 
    // Usually, we might send a list of "kept" image URLs in a field like 'existingImages'.
    // For simplicity, let's assume 'existingImages' field contains URLs to keep.
    
    let keptImages = [];
    if (req.body.existingImages) {
        try {
            keptImages = Array.isArray(req.body.existingImages) 
                ? req.body.existingImages 
                : JSON.parse(req.body.existingImages);
        } catch (e) {
            keptImages = [];
        }
    } else {
        // If not explicitly sent, maybe we keep all? Or maybe the frontend sends everything?
        // Better pattern: Frontend sends 'existingImages' array.
        // If not present, we assume we keep none? Or keep all?
        // Let's assume if 'existingImages' is missing, we keep existing ones (unless replaced).
        // But for file upload, usually we append or replace.
        // Let's rely on 'existingImages' being passed if we want to keep any.
        // If undefined, we'll default to keeping current ones (safer).
        if (req.body.existingImages === undefined) {
             keptImages = currentImages;
        }
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const finalImages = [...keptImages, ...uploadedImages];

    if (finalImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per product/service.`
      });
    }

    let parsedFeatures = items[itemIndex].features || [];
    if (features !== undefined) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        parsedFeatures = [];
      }
    }

    const updatedItem = {
      ...items[itemIndex],
      type: type || items[itemIndex].type,
      title: title || items[itemIndex].title,
      description: description || items[itemIndex].description,
      features: Array.isArray(parsedFeatures) ? parsedFeatures.filter(Boolean) : [],
      sector: sector || items[itemIndex].sector,
      subsector: subsector || items[itemIndex].subsector,
      serviceCategory: serviceCategory !== undefined ? serviceCategory : items[itemIndex].serviceCategory,
      companyName: resolveItemCompanyName(currentCompany, companyName || companyValue) || items[itemIndex].companyName,
      company: resolveItemCompanyName(currentCompany, companyName || companyValue) || items[itemIndex].company,
      companyId: companyId || items[itemIndex].companyId || req.params.id,
      images: finalImages,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[itemIndex] = updatedItem;

    const updatedTabs = {
      ...(currentCompany.tabs || {}),
      productsServices: {
        ...(currentCompany.tabs?.productsServices || {}),
        items: updatedItems,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
        action: 'product_service.update',
        companyId: currentCompany.id,
        userId: req.user.userId,
        itemId: updatedItem.id,
        metadata: { title: updatedItem.title }
    });

    return res.json({
      success: true,
      message: 'Product/service updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating product/service:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.patch('/:id/products-services/:itemId/archive', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.productsServices?.items || [];
    const itemIndex = items.findIndex((i) => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product/service not found'
      });
    }

    const archived = Boolean(req.body?.archived);
    const status = archived ? 'archived' : 'active'; // Add status field if not present

    const updatedItem = {
      ...items[itemIndex],
      status, // Ensure status is set
      archivedAt: archived ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[itemIndex] = updatedItem;

    const updatedTabs = {
      ...(company.tabs || {}),
      productsServices: {
        ...(company.tabs?.productsServices || {}),
        items: updatedItems,
      },
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
        action: archived ? 'product_service.archive' : 'product_service.restore',
        companyId: company.id,
        userId: req.user.userId,
        itemId: updatedItem.id,
        metadata: { title: updatedItem.title }
    });

    return res.json({
      success: true,
      message: archived ? 'Product/service archived successfully' : 'Product/service restored successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error archiving product/service:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id/products-services/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.productsServices?.items || [];
    const exists = items.some((i) => i.id === req.params.itemId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Product/service not found'
      });
    }

    const updatedItems = items.filter((i) => i.id !== req.params.itemId);

    const updatedTabs = {
      ...(company.tabs || {}),
      productsServices: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });

    return res.json({
      success: true,
      message: 'Product/service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product/service:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update company status (e.g. Archive)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const company = await findCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const updated = await updateCompany(req.params.id, { status });
    
    await addAuditLog({
        action: 'company.status_update',
        companyId: company.id,
        userId: req.user.userId,
        metadata: { oldStatus: company.status, newStatus: status }
    });

    return res.json({ success: true, data: formatCompanyForApi(updated) });
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('Error updating company status:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/:id/projects', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      description,
      workDelivered,
      outcome,
      clientName,
      projectDate,
      projectValue,
      location,
      keyFeatures,
      descriptionVisibility,
      url
    } = req.body;

    if (!title || !description || !clientName || !projectDate || !projectValue || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, client name, project date, project value, and location are required'
      });
    }

    const parsedDate = new Date(projectDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Project date is invalid'
      });
    }

    const plan = company.subscription?.plan || 'premium';
    const { maxItems, maxWords, maxImagesPerItem } = getProjectLimits(plan);

    if (!company.tabs) company.tabs = {};
    if (!company.tabs.projects) {
      company.tabs.projects = { enabled: false, items: [] };
    }

    const currentItems = company.tabs.projects.items || [];
    if (currentItems.length >= maxItems) {
      return res.status(400).json({
        success: false,
        message: `Plan limit reached. ${plan} plan allows up to ${maxItems} projects.`
      });
    }

    const words = description.trim().split(/\s+/).filter(Boolean).length;
    if (words > maxWords) {
      return res.status(400).json({
        success: false,
        message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
      });
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    if (uploadedImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per project.`
      });
    }

    const visibility = descriptionVisibility === 'private' ? 'private' : 'public';
    if (visibility === 'private' && !canUseProjectVisibilityControl(plan)) {
      return res.status(403).json({
        success: false,
        message: 'Your plan does not allow private project descriptions'
      });
    }

    let parsedFeatures = [];
    if (keyFeatures) {
      try {
        parsedFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
      } catch (e) {
        parsedFeatures = [];
      }
    }

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      descriptionVisibility: visibility,
      workDelivered: workDelivered || '',
      outcome: outcome || '',
      clientName,
      projectDate,
      projectValue,
      location,
      keyFeatures: Array.isArray(parsedFeatures) ? parsedFeatures.filter(Boolean) : [],
      url: url || '',
      images: uploadedImages,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    company.tabs.projects.items = [...currentItems, newProject];
    company.tabs.projects.enabled = true;

    await updateCompany(req.params.id, { tabs: company.tabs });

    // Auto-add to showcase if company has active subscription (premium/elite)
    const companyPlan = company.subscription?.plan?.toLowerCase() || '';
    const hasActiveSubscription = companyPlan === 'premium' || companyPlan === 'elite';
    const isPublicVisibility = visibility === 'public';

    if (hasActiveSubscription && isPublicVisibility) {
      try {
        // Get current showcase content
        const showcaseContent = getContent('showcase') || [];

        // Create showcase entry from project
        const showcaseEntry = {
          id: `showcase-${newProject.id}`,
          title: newProject.title,
          company: company.companyName,
          sector: Array.isArray(company.industrySector) && company.industrySector.length > 0
            ? company.industrySector[0]
            : 'Project',
          location: newProject.location,
          projectValue: newProject.projectValue,
          completedDate: newProject.projectDate,
          images: Array.isArray(newProject.images) ? newProject.images : [],
          overview: newProject.description,
          workDelivered: newProject.workDelivered,
          keyFeatures: Array.isArray(newProject.keyFeatures) ? newProject.keyFeatures : [],
          companyId: company.id,
          projectId: newProject.id,
          addedToShowcaseAt: new Date().toISOString(),
          featured: false
        };

        // Add to showcase (prepend to show newest first)
        const updatedShowcase = [showcaseEntry, ...showcaseContent];

        // Limit showcase to reasonable size (e.g., 100 items)
        if (updatedShowcase.length > 100) {
          updatedShowcase.splice(100);
        }

        updateContent('showcase', updatedShowcase);
        console.log(`[Showcase] Added project "${newProject.title}" from company "${company.companyName}" to showcase (plan: ${companyPlan})`);

        // Also update the project to mark it as showcased
        const updatedProjectItems = company.tabs.projects.items.map(p =>
          p.id === newProject.id ? { ...p, showcased: true, showcasedAt: new Date().toISOString() } : p
        );
        company.tabs.projects.items = updatedProjectItems;
        await updateCompany(req.params.id, { tabs: company.tabs });
      } catch (showcaseError) {
        console.error('[Showcase] Error adding project to showcase:', showcaseError);
        // Don't fail the project creation if showcase update fails
      }
    } else {
      console.log(`[Showcase] Project "${newProject.title}" NOT added to showcase (plan: ${companyPlan}, visibility: ${visibility})`);
    }

    await addAuditLog({
      action: 'project.create',
      companyId: company.id,
      userId: String(req.user.userId),
      projectId: newProject.id,
      metadata: { title: newProject.title }
    });

    return res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: newProject
    });
  } catch (error) {
    console.error('Error adding project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id/projects/:projectId', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.projects?.items || [];
    const projectIndex = items.findIndex((i) => i.id === req.params.projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const {
      title,
      description,
      workDelivered,
      outcome,
      clientName,
      projectDate,
      projectValue,
      location,
      keyFeatures,
      descriptionVisibility,
      url
    } = req.body;

    if (projectDate) {
      const parsedDate = new Date(projectDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Project date is invalid'
        });
      }
    }

    const plan = company.subscription?.plan || 'premium';
    const { maxWords, maxImagesPerItem } = getProjectLimits(plan);

    if (typeof description === 'string') {
      const words = description.trim().split(/\s+/).filter(Boolean).length;
      if (words > maxWords) {
        return res.status(400).json({
          success: false,
          message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
        });
      }
    }

    let visibility = items[projectIndex].descriptionVisibility || 'public';
    if (descriptionVisibility) {
      visibility = descriptionVisibility === 'private' ? 'private' : 'public';
      if (visibility === 'private' && !canUseProjectVisibilityControl(plan)) {
        return res.status(403).json({
          success: false,
          message: 'Your plan does not allow private project descriptions'
        });
      }
    }

    let parsedFeatures = items[projectIndex].keyFeatures || [];
    if (keyFeatures !== undefined) {
      try {
        parsedFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
      } catch (e) {
        parsedFeatures = [];
      }
    }

    let keptImages = [];
    if (req.body.existingImages) {
      try {
        keptImages = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : JSON.parse(req.body.existingImages);
      } catch (e) {
        keptImages = [];
      }
    } else if (req.body.existingImages === undefined) {
      keptImages = items[projectIndex].images || [];
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const finalImages = [...keptImages, ...uploadedImages];

    if (finalImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per project.`
      });
    }

    const updatedProject = {
      ...items[projectIndex],
      title: title !== undefined ? title : items[projectIndex].title,
      description: description !== undefined ? description : items[projectIndex].description,
      descriptionVisibility: visibility,
      workDelivered: workDelivered !== undefined ? workDelivered : items[projectIndex].workDelivered,
      outcome: outcome !== undefined ? outcome : items[projectIndex].outcome,
      clientName: clientName !== undefined ? clientName : items[projectIndex].clientName,
      projectDate: projectDate !== undefined ? projectDate : items[projectIndex].projectDate,
      projectValue: projectValue !== undefined ? projectValue : items[projectIndex].projectValue,
      location: location !== undefined ? location : items[projectIndex].location,
      keyFeatures: Array.isArray(parsedFeatures) ? parsedFeatures.filter(Boolean) : [],
      url: url !== undefined ? url : items[projectIndex].url,
      images: finalImages,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[projectIndex] = updatedProject;

    const updatedTabs = {
      ...(company.tabs || {}),
      projects: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: 'project.update',
      companyId: company.id,
      userId: req.user.userId,
      projectId: updatedProject.id,
      metadata: { title: updatedProject.title }
    });

    return res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.patch('/:id/projects/:projectId/archive', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.projects?.items || [];
    const projectIndex = items.findIndex((i) => i.id === req.params.projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const archived = Boolean(req.body?.archived);
    const status = archived ? 'archived' : 'active';

    const updatedProject = {
      ...items[projectIndex],
      status,
      archivedAt: archived ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[projectIndex] = updatedProject;

    const updatedTabs = {
      ...(company.tabs || {}),
      projects: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: archived ? 'project.archive' : 'project.restore',
      companyId: company.id,
      userId: req.user.userId,
      projectId: updatedProject.id,
      metadata: { title: updatedProject.title }
    });

    return res.json({
      success: true,
      message: archived ? 'Project archived successfully' : 'Project restored successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error archiving project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id/projects/:projectId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.projects?.items || [];
    const exists = items.some((i) => i.id === req.params.projectId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updatedItems = items.filter((i) => i.id !== req.params.projectId);

    const updatedTabs = {
      ...(company.tabs || {}),
      projects: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: 'project.delete',
      companyId: company.id,
      userId: req.user.userId,
      projectId: req.params.projectId
    });

    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/:id/awards', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      description,
      awardDate,
      awardingBody,
      category,
      location,
      keyHighlights,
      url
    } = req.body;

    if (!title || !description || !awardDate || !awardingBody) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, award date, and awarding body are required'
      });
    }

    const parsedDate = new Date(awardDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Award date is invalid'
      });
    }

    const plan = company.subscription?.plan || 'premium';
    const { maxItems, maxWords, maxImagesPerItem } = getAwardLimits(plan);

    if (!company.tabs) company.tabs = {};
    if (!company.tabs.awards) {
      company.tabs.awards = { enabled: false, items: [] };
    }

    const currentItems = company.tabs.awards.items || [];
    if (currentItems.length >= maxItems) {
      return res.status(400).json({
        success: false,
        message: `Plan limit reached. ${plan} plan allows up to ${maxItems} awards.`
      });
    }

    const words = description.trim().split(/\s+/).filter(Boolean).length;
    if (words > maxWords) {
      return res.status(400).json({
        success: false,
        message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
      });
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    if (uploadedImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per award.`
      });
    }

    let parsedHighlights = [];
    if (keyHighlights) {
      try {
        parsedHighlights = typeof keyHighlights === 'string' ? JSON.parse(keyHighlights) : keyHighlights;
      } catch (e) {
        parsedHighlights = [];
      }
    }

    const newAward = {
      id: Date.now().toString(),
      title,
      description,
      awardDate,
      awardingBody,
      category: category || '',
      location: location || '',
      url: url || '',
      keyHighlights: Array.isArray(parsedHighlights) ? parsedHighlights.filter(Boolean) : [],
      images: uploadedImages,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    company.tabs.awards.items = [...currentItems, newAward];
    company.tabs.awards.enabled = true;

    await updateCompany(req.params.id, { tabs: company.tabs });
    await addAuditLog({
      action: 'award.create',
      companyId: company.id,
      userId: req.user.userId,
      awardId: newAward.id,
      metadata: { title: newAward.title }
    });

    return res.status(201).json({
      success: true,
      message: 'Award added successfully',
      data: newAward
    });
  } catch (error) {
    console.error('Error adding award:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id/awards/:awardId', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.awards?.items || [];
    const awardIndex = items.findIndex((i) => i.id === req.params.awardId);
    if (awardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const {
      title,
      description,
      awardDate,
      awardingBody,
      category,
      location,
      keyHighlights,
      url
    } = req.body;

    if (awardDate) {
      const parsedDate = new Date(awardDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Award date is invalid'
        });
      }
    }

    const plan = company.subscription?.plan || 'premium';
    const { maxWords, maxImagesPerItem } = getAwardLimits(plan);

    if (typeof description === 'string') {
      const words = description.trim().split(/\s+/).filter(Boolean).length;
      if (words > maxWords) {
        return res.status(400).json({
          success: false,
          message: `Word limit reached. ${plan} plan allows up to ${maxWords} words.`
        });
      }
    }

    let parsedHighlights = items[awardIndex].keyHighlights || [];
    if (keyHighlights !== undefined) {
      try {
        parsedHighlights = typeof keyHighlights === 'string' ? JSON.parse(keyHighlights) : keyHighlights;
      } catch (e) {
        parsedHighlights = [];
      }
    }

    let keptImages = [];
    if (req.body.existingImages) {
      try {
        keptImages = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : JSON.parse(req.body.existingImages);
      } catch (e) {
        keptImages = [];
      }
    } else if (req.body.existingImages === undefined) {
      keptImages = items[awardIndex].images || [];
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const finalImages = [...keptImages, ...uploadedImages];

    if (finalImages.length > maxImagesPerItem) {
      return res.status(400).json({
        success: false,
        message: `Too many images. ${plan} plan allows up to ${maxImagesPerItem} images per award.`
      });
    }

    const updatedAward = {
      ...items[awardIndex],
      title: title !== undefined ? title : items[awardIndex].title,
      description: description !== undefined ? description : items[awardIndex].description,
      awardDate: awardDate !== undefined ? awardDate : items[awardIndex].awardDate,
      awardingBody: awardingBody !== undefined ? awardingBody : items[awardIndex].awardingBody,
      category: category !== undefined ? category : items[awardIndex].category,
      location: location !== undefined ? location : items[awardIndex].location,
      url: url !== undefined ? url : items[awardIndex].url,
      keyHighlights: Array.isArray(parsedHighlights) ? parsedHighlights.filter(Boolean) : [],
      images: finalImages,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[awardIndex] = updatedAward;

    const updatedTabs = {
      ...(company.tabs || {}),
      awards: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: 'award.update',
      companyId: company.id,
      userId: req.user.userId,
      awardId: updatedAward.id,
      metadata: { title: updatedAward.title }
    });

    return res.json({
      success: true,
      message: 'Award updated successfully',
      data: updatedAward
    });
  } catch (error) {
    console.error('Error updating award:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.patch('/:id/awards/:awardId/archive', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.awards?.items || [];
    const awardIndex = items.findIndex((i) => i.id === req.params.awardId);
    if (awardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const archived = Boolean(req.body?.archived);
    const status = archived ? 'archived' : 'active';

    const updatedAward = {
      ...items[awardIndex],
      status,
      archivedAt: archived ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items];
    updatedItems[awardIndex] = updatedAward;

    const updatedTabs = {
      ...(company.tabs || {}),
      awards: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: archived ? 'award.archive' : 'award.restore',
      companyId: company.id,
      userId: req.user.userId,
      awardId: updatedAward.id,
      metadata: { title: updatedAward.title }
    });

    return res.json({
      success: true,
      message: archived ? 'Award archived successfully' : 'Award restored successfully',
      data: updatedAward
    });
  } catch (error) {
    console.error('Error archiving award:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id/awards/:awardId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const items = company.tabs?.awards?.items || [];
    const exists = items.some((i) => i.id === req.params.awardId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const updatedItems = items.filter((i) => i.id !== req.params.awardId);

    const updatedTabs = {
      ...(company.tabs || {}),
      awards: {
        enabled: updatedItems.length > 0,
        items: updatedItems
      }
    };

    await updateCompany(req.params.id, { tabs: updatedTabs });
    await addAuditLog({
      action: 'award.delete',
      companyId: company.id,
      userId: req.user.userId,
      awardId: req.params.awardId
    });

    return res.json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting award:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a new company (protected route)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      companyName,
      companyRegNumber,
      companyAddress,
      postCode,
      companyWebsite,
      websiteLink,
      socialMediaLinks,
      industrySector,
      mainSector,
      productsServiceCategories,
      productsServices,
      companyBio,
      isRecruitmentCompany,
      regions,
      // Contact person details
      firstName,
      lastName,
      contactEmail,
      phoneNumber,
      role,
      // Subscription details
      selectedPlan,
      selectedAddons,
      billingCycle
    } = req.body;

    // Validate required fields
    if (!companyName || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Company name and contact email are required'
      });
    }

    const normalizedWebsiteLink = normalizeUrl(websiteLink || companyWebsite);
    if ((websiteLink || companyWebsite) && !normalizedWebsiteLink) {
      return res.status(400).json({
        success: false,
        message: 'Website link must be a valid URL'
      });
    }

    const normalizedSocialMediaLinks = sanitizeSocialMediaLinks(socialMediaLinks);

    // Check if company already exists for this user
    const existingCompany = await findCompanyByUserId(req.user.userId);
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company already exists for this user'
      });
    }

    // Normalize selectedAddons to ensure array of strings only
    const normalizedAddons = Array.isArray(selectedAddons)
      ? selectedAddons.map(addon => {
          if (typeof addon === 'string') return addon;
          // Extract ID from addon object
          return addon?.id || addon?._id || addon?.addonId || '';
        }).filter(Boolean)
      : [];

    const companyData = {
      userId: req.user.userId,
      companyName,
      companyRegNumber,
      companyAddress,
      postCode,
      companyWebsite: normalizedWebsiteLink || '',
      websiteLink: normalizedWebsiteLink || '',
      socialMediaLinks: normalizedSocialMediaLinks,
      industrySector: industrySector || [],
      mainSector: normalizeMainSector(mainSector, industrySector || []),
      productsServiceCategories: Array.isArray(productsServiceCategories) ? productsServiceCategories : [],
      productsServices: productsServices || '',
      companyBio: companyBio || '',
      companyNews: [],
      isRecruitmentCompany: isRecruitmentCompany || 'No',
      regions: regions || [],
      // Contact person details
      contactPerson: {
        firstName,
        lastName,
        email: contactEmail,
        phoneNumber,
        role
      },
      // Subscription details
      subscription: {
        plan: selectedPlan ? (typeof selectedPlan === 'string' ? selectedPlan : selectedPlan?.name || 'basic') : null,
        addons: normalizedAddons,
        billingCycle: billingCycle || 'monthly',
        status: selectedPlan ? 'active' : 'inactive',
        // Set start/end dates if plan is selected (will be updated by Stripe webhook after payment)
        ...(selectedPlan && {
          startDate: new Date().toISOString(),
          endDate: (() => {
            const end = new Date();
            const daysToAdd = (billingCycle === 'annual' || billingCycle === 'yearly') ? 365 : 30;
            end.setDate(end.getDate() + daysToAdd);
            return end.toISOString();
          })()
        })
      },
      // Profile completion tracking
      profileCompletion: {
        contactInfo: !!(firstName && lastName && contactEmail && phoneNumber && role),
        companyDetails: !!(companyName && companyRegNumber && companyAddress && postCode),
        sectors: industrySector && industrySector.length > 0,
        regions: regions && regions.length > 0,
        subscription: !!selectedPlan
      }
    };

    const company = await createCompany(companyData);

    if (selectedPlan) {
      const recipientList = [req.user?.email, contactEmail]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase())
        .filter((value, index, arr) => arr.indexOf(value) === index);

      const addonNames = Array.isArray(selectedAddons)
        ? selectedAddons.map((addon) => {
            if (typeof addon === 'string') return addon;
            return addon?.name || addon?.id || '';
          }).filter(Boolean)
        : [];
      const planName = typeof selectedPlan === 'string' ? selectedPlan : selectedPlan?.name || null;
      const totalAmount = typeof selectedPlan === 'object' ? selectedPlan?.totalPrice : null;

      if (recipientList.length > 0) {
        const emailResult = await sendSubscriptionPurchaseConfirmationEmail({
          email: recipientList.join(','),
          username: req.user.username || firstName || '',
          planName,
          billingCycle: billingCycle || (typeof selectedPlan === 'object' ? selectedPlan?.interval : null),
          addonNames,
          totalAmount,
        });

        if (!emailResult.success) {
          console.error('Failed to send subscription confirmation email:', emailResult.error);
        } else {
          console.log(`Subscription confirmation email delivered to: ${recipientList.join(', ')}`);
        }
      } else {
        console.error('Failed to send subscription confirmation email: No recipient email available');
      }
    }

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: formatCompanyForApi(company)
    });

  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/onboard', verifyToken, requireAdmin, upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'productImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      companyName,
      companyRegNumber,
      companyAddress,
      postCode,
      companyWebsite,
      websiteLink,
      socialMediaLinks,
      industrySector,
      mainSector,
      productsServiceCategories,
      hierarchicalProductsServices,
      productsServices,
      isRecruitmentCompany,
      regions,
      companyBio,
      companyNews,
      // Contact person details
      firstName,
      lastName,
      contactEmail,
      phoneNumber,
      role
    } = req.body;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    const normalizedWebsiteLink = normalizeUrl(websiteLink || companyWebsite);
    if ((websiteLink || companyWebsite) && !normalizedWebsiteLink) {
      return res.status(400).json({
        success: false,
        message: 'Website link must be a valid URL'
      });
    }

    const normalizedSocialMediaLinks = sanitizeSocialMediaLinks(socialMediaLinks);

    // Parse hierarchical products services if it's a string
    let parsedHierarchicalProductsServices = {};
    if (hierarchicalProductsServices) {
      try {
        if (typeof hierarchicalProductsServices === 'string') {
          parsedHierarchicalProductsServices = JSON.parse(hierarchicalProductsServices);
        } else {
          parsedHierarchicalProductsServices = hierarchicalProductsServices;
        }
      } catch (error) {
        console.error('Error parsing hierarchical products services:', error);
      }
    }

    // Process uploaded files
    const companyLogo = req.files.companyLogo ? req.files.companyLogo[0] : null;
    const productImages = req.files.productImages || [];

    let parsedCompanyNews = [];
    try {
      parsedCompanyNews = typeof companyNews === 'string' ? JSON.parse(companyNews) : (companyNews || []);
    } catch (e) {
      parsedCompanyNews = [];
    }
    parsedCompanyNews = (parsedCompanyNews || []).filter(n => (n.title || '').trim()).slice(0, 6);

    const companyData = {
      userId: String(req.user.userId),
      createdByUserId: String(req.user.userId),
      companyName,
      companyRegNumber,
      companyAddress,
      postCode,
      companyWebsite: normalizedWebsiteLink || '',
      websiteLink: normalizedWebsiteLink || '',
      socialMediaLinks: normalizedSocialMediaLinks,
      industrySector: industrySector || [],
      mainSector: mainSector || null,
      productsServiceCategories: Array.isArray(productsServiceCategories) ? productsServiceCategories : [],
      hierarchicalProductsServices: parsedHierarchicalProductsServices,
      productsServices: productsServices || '',
      companyBio: companyBio || '',
      companyNews: parsedCompanyNews,
      isRecruitmentCompany: isRecruitmentCompany || 'No',
      regions: regions || [],
      companyLogo: companyLogo ? `/uploads/${companyLogo.filename}` : null,
      productImages: productImages.map(file => `/uploads/${file.filename}`),
      contactPerson: {
        firstName,
        lastName,
        email: contactEmail,
        phoneNumber,
        role
      },
      // Enhanced profile completion tracking
      profileCompletion: {
        contactInfo: !!(firstName && lastName && contactEmail && phoneNumber && role),
        companyDetails: !!(companyName && companyRegNumber && companyAddress && postCode),
        sectors: industrySector && industrySector.length > 0,
        regions: regions && regions.length > 0,
        productsServices: productsServiceCategories && productsServiceCategories.length > 0,
        hierarchicalProductsServices: Object.keys(parsedHierarchicalProductsServices).length > 0
      },
      // Default subscription (can be updated later by admin)
      subscription: (() => {
        const subscriptionMonthsInt = parseInt(req.body.subscriptionMonths || 12);
        const startDate = new Date();
        const endDate = new Date();
        
        // Calculate days based on subscription months
        let daysToAdd = 30; // Default monthly
        let billingCycle = 'monthly';
        if (subscriptionMonthsInt >= 12) {
          daysToAdd = 365;
          billingCycle = 'annual';
        }
        
        endDate.setDate(endDate.getDate() + daysToAdd);
        
        return {
          plan: req.body.subscriptionPlan || 'premium',
          months: subscriptionMonthsInt,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          billingCycle: billingCycle,
          status: 'active'
        };
      })()
    };

    const company = await createCompany(companyData);

    res.status(201).json({
      success: true,
      message: 'Company onboarded successfully with hierarchical products and services',
      data: formatCompanyForApi(company)
    });
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('Error onboarding company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin onboard company with user account creation
router.post('/admin-onboard', verifyToken, requireAdmin, upload.single('companyLogo'), async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      companyName,
      companyLocation,
      companyAddress,
      companyEmail,
      companyPhone,
      postCode,
      companyWebsite,
      websiteLink,
      socialMediaLinks,
      companyOverview,
      companyBio,
      companyNews,
      selectedSectors,
      selectedSubsectors,
      subscriptionPlan,
      subscriptionMonths,
      regions
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (!companyName || !companyLocation || !companyEmail) {
      return res.status(400).json({
        success: false,
        message: 'Company name, location, and email are required'
      });
    }

    const normalizedWebsiteLink = normalizeUrl(websiteLink || companyWebsite);
    if ((websiteLink || companyWebsite) && !normalizedWebsiteLink) {
      return res.status(400).json({
        success: false,
        message: 'Website link must be a valid URL'
      });
    }

    const normalizedSocialMediaLinks = sanitizeSocialMediaLinks(socialMediaLinks);

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const userData = {
      username,
      email,
      password: hashedPassword,
      role: 'company',
      isVerified: true, // Auto-verify since admin is creating
      otp: null,
      otpExpiry: null
    };

    const newUser = await createUser(userData);

    // Parse selected sectors
    let parsedSectors = [];
    try {
      parsedSectors = JSON.parse(selectedSectors || '[]');
    } catch (e) {
      parsedSectors = [];
    }

    // Parse selected subsectors
    let parsedSubsectors = {};
    try {
      parsedSubsectors = JSON.parse(selectedSubsectors || '{}');
    } catch (e) {
      parsedSubsectors = {};
    }

    // Parse selected regions
    let parsedRegions = [];
    try {
      parsedRegions = JSON.parse(regions || '[]');
    } catch (e) {
      parsedRegions = [companyLocation]; // Fallback to company location if parsing fails
    }

    // Process uploaded logo
    const companyLogo = req.file ? `/uploads/${req.file.filename}` : null;

    // Calculate subscription dates based on billing cycle
    const startDate = new Date();
    const endDate = new Date();
    
    // Determine days to add based on billing cycle
    let daysToAdd = 30; // Default to monthly (30 days)
    let billingCycle = 'monthly';
    const subscriptionMonthsInt = parseInt(subscriptionMonths || 12);
    
    // If subscriptionMonths is 12 or plan suggests annual, use 365 days
    if (subscriptionMonthsInt >= 12 || (subscriptionPlan && subscriptionPlan.toLowerCase().includes('annual'))) {
      daysToAdd = 365;
      billingCycle = 'annual';
    }
    
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Create company
    let parsedCompanyNews = [];
    try {
      parsedCompanyNews = typeof companyNews === 'string' ? JSON.parse(companyNews) : (companyNews || []);
    } catch (e) {
      parsedCompanyNews = [];
    }
    const maxNews = (subscriptionPlan === 'elite') ? 6 : 3;
    parsedCompanyNews = (parsedCompanyNews || []).filter(n => (n.title || '').trim()).slice(0, maxNews);

    const companyData = {
      userId: newUser._id.toString(),
      createdByUserId: String(req.user.userId),
      companyName,
      companyAddress: companyAddress || companyLocation,
      postCode: postCode || '',
      industrySector: parsedSectors,
      mainSector: parsedSectors[0] || null,
      selectedSubsectors: parsedSubsectors,
      productsServiceCategories: [],
      hierarchicalProductsServices: {},
      productsServices: companyOverview || '',
      companyBio: companyBio || '',
      companyNews: parsedCompanyNews,
      isRecruitmentCompany: 'No',
      regions: parsedRegions.length > 0 ? parsedRegions : [companyLocation],
      companyLogo,
      companyWebsite: normalizedWebsiteLink || '',
      websiteLink: normalizedWebsiteLink || '',
      socialMediaLinks: normalizedSocialMediaLinks,
      productImages: [],
      contactPerson: {
        firstName: username,
        lastName: '',
        email: companyEmail,
        phoneNumber: companyPhone || '',
        role: 'Company Admin'
      },
      // Subscription details
      subscription: {
        plan: subscriptionPlan || 'premium',
        months: subscriptionMonthsInt,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        billingCycle: billingCycle,
        status: 'active'
      },
      // Company page tabs (initially empty, will be populated as company adds content)
      tabs: {
        overview: {
          enabled: true,
          content: companyOverview || ''
        },
        products: {
          enabled: false,
          items: []
        },
        services: {
          enabled: false,
          items: []
        },
        projects: {
          enabled: false,
          items: []
        },
        caseStudies: {
          enabled: false,
          items: []
        },
        blogs: {
          enabled: false,
          items: []
        },
        events: {
          enabled: false,
          items: []
        }
      },
      // Profile completion tracking
      profileCompletion: {
        contactInfo: true,
        companyDetails: true,
        sectors: parsedSectors.length > 0,
        regions: true,
        productsServices: false,
        subscription: true
      }
    };

    const company = await createCompany(companyData);
    const formattedCompany = formatCompanyForApi(company);

    res.status(201).json({
      success: true,
      message: 'Company onboarded successfully with user account created',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        company: {
          id: formattedCompany.id,
          companyName: formattedCompany.companyName,
          companyLocation: formattedCompany.companyAddress,
          selectedSectors: formattedCompany.industrySector,
          selectedSubsectors: formattedCompany.selectedSubsectors,
          subscription: formattedCompany.subscription
        }
      }
    });

  } catch (error) {
    console.error('Error in admin company onboarding:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during onboarding'
    });
  }
});

// Add product/service to company
router.post('/:id/products-services', verifyToken, upload.fields([{name: 'images', maxCount: 10}, {name: 'certificateFile', maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    // Accept if user ID matches OR if company was created by this user
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { type, title, description, features, sector, subsector } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Initialize tabs if not exists
    if (!company.tabs) {
      company.tabs = {};
    }
    if (!company.tabs.productsServices) {
      company.tabs.productsServices = { enabled: false, items: [] };
    }

    // Process uploaded images
    const images = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(file => `/uploads/${file.filename}`);

    // Parse features if string
    let parsedFeatures = [];
    try {
      parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    } catch (e) {
      parsedFeatures = [];
    }

    // Add new item
    const newItem = {
      id: Date.now().toString(),
      type: type || 'product',
      title,
      description,
      features: parsedFeatures || [],
      images,
      sector: sector || '',
      subsector: subsector || '',
      createdAt: new Date().toISOString()
    };

    if (!company.tabs.productsServices.items) {
      company.tabs.productsServices.items = [];
    }

    company.tabs.productsServices.items.push(newItem);
    company.tabs.productsServices.enabled = true;

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Product/Service added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding product/service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete product from company
router.delete('/:id/products/:productId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { productId } = req.params;

    if (!company.tabs || !company.tabs.products || !company.tabs.products.items) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Remove product
    company.tabs.products.items = company.tabs.products.items.filter(p => p.id !== productId);

    // Disable tab if no products left
    if (company.tabs.products.items.length === 0) {
      company.tabs.products.enabled = false;
    }

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user's company (protected route)
router.get('/my-company', verifyToken, async (req, res) => {
  try {
    console.log(`[my-company] Looking up company for userId: ${req.user?.userId} (type: ${typeof req.user?.userId})`);
    
    const company = await findCompanyByUserId(req.user.userId);
    
    console.log(`[my-company] Lookup result:`, company ? `Found company ${company.companyName}` : 'Company not found');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: formatCompanyForApi(company)
    });

  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('[my-company] Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get company by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const companyIdOrSlug = req.params.id;
    let company = await findCompanyById(companyIdOrSlug, { allowSlug: true });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Return only public information
    const publicCompanyData = {
      id: company._id?.toString(),
      slug: company.slug,
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      postCode: company.postCode,
      industrySector: company.industrySector,
      mainSector: company.mainSector || null,
      productsServiceCategories: company.productsServiceCategories || [],
      productsServices: company.productsServices,
      companyBio: company.companyBio || null,
      companyNews: company.companyNews || [],
      isRecruitmentCompany: company.isRecruitmentCompany,
      regions: company.regions,
      companyLogo: company.companyLogo || null,
      companyWebsite: company.companyWebsite || null,
      websiteLink: company.websiteLink || company.companyWebsite || null,
      socialMediaLinks: company.socialMediaLinks || {},
      subscription: company.subscription || null,
      tabs: company.tabs || null,
      contactPerson: {
        firstName: company.contactPerson?.firstName,
        lastName: company.contactPerson?.lastName,
        role: company.contactPerson?.role,
        email: company.contactPerson?.email,
        phoneNumber: company.contactPerson?.phoneNumber,
      },
      profileCompletion: company.profileCompletion,
      createdAt: company.createdAt
    };

    res.json({
      success: true,
      data: publicCompanyData
    });

  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update company (protected route)
router.put('/:id', verifyToken, upload.single('companyLogo'), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company
    if (company.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = { ...req.body };

    // Parse JSON stringified arrays from FormData
    const arrayFields = ['industrySector', 'regions', 'companyNews', 'socialMediaLinks', 'contactPerson', 'tabs'];
    for (const field of arrayFields) {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {}
      }
    }

    // Handle file upload for companyLogo
    if (req.file) {
      updateData.companyLogo = `/uploads/${req.file.filename}`;
    } else if (updateData.companyLogo && typeof updateData.companyLogo === 'string' && updateData.companyLogo.startsWith('data:image')) {
      const matches = updateData.companyLogo.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        let ext = matches[1];
        if (ext === 'jpeg') ext = 'jpg';
        if (ext === 'avif') ext = 'png';
        const fname = `company-companyLogo-${req.params.id}-${Date.now()}.${ext}`;
        const { writeFileSync } = await import('fs');
        writeFileSync(`/app/uploads/${fname}`, Buffer.from(matches[2], 'base64'));
        updateData.companyLogo = `/uploads/${fname}`;
      }
    }

    if (typeof updateData.socialMediaLinks === 'string') {
      updateData.socialMediaLinks = sanitizeSocialMediaLinks(updateData.socialMediaLinks);
    } else if (Array.isArray(updateData.socialMediaLinks) || typeof updateData.socialMediaLinks === 'object') {
      updateData.socialMediaLinks = sanitizeSocialMediaLinks(updateData.socialMediaLinks);
    }

    const incomingWebsite = updateData.websiteLink || updateData.companyWebsite || updateData.website;
    if (typeof incomingWebsite !== 'undefined') {
      const normalizedWebsiteLink = normalizeUrl(incomingWebsite);
      if (incomingWebsite && !normalizedWebsiteLink) {
        return res.status(400).json({
          success: false,
          message: 'Website link must be a valid URL'
        });
      }
      updateData.websiteLink = normalizedWebsiteLink;
      updateData.companyWebsite = normalizedWebsiteLink;
    }

    // If companyLogo is being updated and company has spotlight enabled, sync the spotlight logo too
    if (updateData.companyLogo && company.spotlight?.enabled) {
      updateData.spotlight = {
        ...company.spotlight,
        companyLogo: updateData.companyLogo
      };
    }

    const updatedCompany = await updateCompany(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: formatCompanyForApi(updatedCompany)
    });

  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete company (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company
    if (company.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const deleted = await deleteCompany(req.params.id);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete company'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all companies (admin route - for now, make it public for testing)
router.get('/', async (req, res) => {
  try {
    const companies = await getAllCompanies();

    // By default exclude archived companies unless explicitly requested
    const includeArchived = req.query.includeArchived === 'true';
    const filteredCompanies = includeArchived
      ? companies
      : companies.filter(c => (c.status || 'Active') !== 'Archived');

    // Return only public information for all companies
    const publicCompanies = filteredCompanies.map(company => ({
      id: company._id?.toString(),
      slug: company.slug,
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      postCode: company.postCode,
      industrySector: company.industrySector,
      mainSector: company.mainSector || null,
      companyLogo: company.companyLogo,
      productImages: company.productImages || [],
      productsServiceCategories: company.productsServiceCategories || [],
      hierarchicalProductsServices: company.hierarchicalProductsServices || {},
      productsServices: company.productsServices,
      companyBio: company.companyBio || null,
      companyNews: company.companyNews || [],
      tabs: company.tabs || null,
      isRecruitmentCompany: company.isRecruitmentCompany,
      regions: company.regions,
      contactPerson: {
        firstName: company.contactPerson?.firstName,
        lastName: company.contactPerson?.lastName,
        role: company.contactPerson?.role,
        email: company.contactPerson?.email,
        phoneNumber: company.contactPerson?.phoneNumber,
      },
      subscription: company.subscription
        ? {
            plan: company.subscription.plan || null,
            startDate: company.subscription.startDate || null,
            endDate: company.subscription.endDate || null,
            status: company.subscription.status || null,
          }
        : null,
      profileCompletion: company.profileCompletion,
      createdAt: company.createdAt,
      status: company.status || 'Active'
    }));

    res.json({
      success: true,
      data: publicCompanies
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get companies by hierarchical products and services category
router.get('/by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { subtopic, topic } = req.query;

    const companies = await getAllCompanies();

    let filteredCompanies = companies.filter(company => {
      // Exclude archived companies
      if ((company.status || 'Active') === 'Archived') return false;

      if (!company.hierarchicalProductsServices) return false;

      // Check if company has the main category
      if (!company.hierarchicalProductsServices[category]) return false;

      // If subtopic is specified, check if company has it
      if (subtopic) {
        if (!company.hierarchicalProductsServices[category][subtopic]) return false;

        // If topic is specified, check if company has it
        if (topic) {
          const topics = company.hierarchicalProductsServices[category][subtopic];
          if (!Array.isArray(topics) || !topics.includes(topic)) return false;
        }
      }

      return true;
    });

    // Return public information for filtered companies
    const publicCompanies = filteredCompanies.map(company => ({
      id: company._id?.toString(),
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      postCode: company.postCode,
      industrySector: company.industrySector,
      mainSector: company.mainSector || null,
      productsServiceCategories: company.productsServiceCategories || [],
      hierarchicalProductsServices: company.hierarchicalProductsServices || {},
      productsServices: company.productsServices,
      companyBio: company.companyBio || null,
      companyNews: company.companyNews || [],
      isRecruitmentCompany: company.isRecruitmentCompany,
      regions: company.regions,
      contactPerson: {
        firstName: company.contactPerson?.firstName,
        lastName: company.contactPerson?.lastName,
        role: company.contactPerson?.role,
        email: company.contactPerson?.email,
        phoneNumber: company.contactPerson?.phoneNumber,
      },
      profileCompletion: company.profileCompletion,
      createdAt: company.createdAt
    }));

    res.json({
      success: true,
      data: publicCompanies,
      count: publicCompanies.length,
      filters: { category, subtopic, topic }
    });

  } catch (error) {
    console.error('Error fetching companies by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get companies by hierarchical products and services categories (for Products & Services page)
router.get('/by-hierarchical-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { subtopic, topic } = req.query;

    console.log(`\n[by-hierarchical-category] === FETCHING FOR CATEGORY: ${category} ===`);

    const companies = await getAllCompanies();
    console.log(`[by-hierarchical-category] Total companies: ${companies.length}`);

    // Log all companies with their products/services
    companies.forEach(company => {
      const hasProducts = company.tabs?.productsServices?.items?.length > 0;
      if (hasProducts) {
        console.log(`[by-hierarchical-category] Company: ${company.companyName}`);
        company.tabs.productsServices.items.forEach(item => {
          console.log(`  - Product: ${item.title}, Sector: "${item.sector}", Subsector: "${item.subsector}"`);
        });
      }
    });

    let filteredCompanies = companies.filter(company => {
      // Exclude archived companies
      if ((company.status || 'Active') === 'Archived') return false;

      // Check hierarchical products services first
      if (company.hierarchicalProductsServices && company.hierarchicalProductsServices[category]) {
        if (subtopic) {
          if (company.hierarchicalProductsServices[category][subtopic]) {
            if (topic) {
              const topics = company.hierarchicalProductsServices[category][subtopic];
              if (Array.isArray(topics) && topics.includes(topic)) return true;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      }

      // Also check products/services added through the admin UI (company.tabs.productsServices)
      const productsServices = company.tabs?.productsServices?.items || [];
      if (productsServices.length > 0) {
        // Build a comprehensive category matcher that covers all IDs and labels used
        // by both AdminProductsServices and the Products & Services page
        const getCategoryMatches = (cat) => {
          const map = {
            'renewable-energy':        ['renewable-energy', 'renewable energy', 'renewable'],
            'sustainable-esg-net-zero': ['sustainable-esg-net-zero', 'sustainable-esg-netzero', 'sustainable / esg / net zero', 'sustainable/esg/net zero', 'sustainable', 'esg', 'net zero'],
            'energy-management':       ['energy-management', 'energy management'],
            'company-wellness':        ['company-wellness', 'company wellness'],
            'it-related-services':     ['it-related-services', 'it related service', 'it related services', 'it', 'cloud solutions', 'cybersecurity', 'managed it'],
            'job-recruitment':         ['job-recruitment', 'jobs-recruitment', 'jobs & recruitment', 'jobs and recruitment', 'recruitment', 'job recruitment'],
            'finance-funding':         ['finance-funding', 'finance & funding', 'finance and funding', 'finance', 'funding'],
            'eco-friendly-passivhaus': ['eco-friendly-passivhaus', 'eco friendly / passivhaus', 'eco friendly', 'passivhaus'],
            'utility-provision-civils':['utility-provision-civils', 'utility provision & civils', 'utility provision and civils', 'utility', 'civils'],
          };
          return map[cat] || [cat.toLowerCase()];
        };

        const categoryMatches = getCategoryMatches(category);

        const hasMatch = productsServices.some(item => {
          const itemSector = (item.sector || '').toLowerCase().trim();
          const itemSubsector = (item.subsector || '').toLowerCase().trim();

          const match = categoryMatches.some(keyword =>
            itemSector.includes(keyword.toLowerCase()) ||
            itemSubsector.includes(keyword.toLowerCase())
          );

          if (match) {
            console.log(`[by-hierarchical-category] Match found - Company: ${company.companyName}, Item: ${item.title}, Sector: ${item.sector}, Subsector: ${item.subsector}`);
          }

          return match;
        });

        return hasMatch;
      }

      return false;
    });

    console.log(`[by-hierarchical-category] Filtered companies count: ${filteredCompanies.length}`);

    // Return formatted data for Products & Services page
    const getCategoryMatchesForFormat = (cat) => {
      const map = {
        'renewable-energy':        ['renewable-energy', 'renewable energy', 'renewable'],
        'sustainable-esg-net-zero': ['sustainable-esg-net-zero', 'sustainable-esg-netzero', 'sustainable / esg / net zero', 'sustainable/esg/net zero', 'sustainable', 'esg', 'net zero'],
        'energy-management':       ['energy-management', 'energy management'],
        'company-wellness':        ['company-wellness', 'company wellness'],
        'it-related-services':     ['it-related-services', 'it related service', 'it related services', 'it', 'cloud solutions', 'cybersecurity', 'managed it'],
        'job-recruitment':         ['job-recruitment', 'jobs-recruitment', 'jobs & recruitment', 'jobs and recruitment', 'recruitment', 'job recruitment'],
        'finance-funding':         ['finance-funding', 'finance & funding', 'finance and funding', 'finance', 'funding'],
        'eco-friendly-passivhaus': ['eco-friendly-passivhaus', 'eco friendly / passivhaus', 'eco friendly', 'passivhaus'],
        'utility-provision-civils':['utility-provision-civils', 'utility provision & civils', 'utility provision and civils', 'utility', 'civils'],
      };
      return map[cat] || [cat.toLowerCase()];
    };

    const formattedCompanies = filteredCompanies.map(company => {
      // Get products/services that match this category
      const productsServices = company.tabs?.productsServices?.items || [];
      const categoryMatchKeywords = getCategoryMatchesForFormat(req.params.category);

      const matchingProducts = productsServices.filter(item => {
        const itemSector = (item.sector || '').toLowerCase().trim();
        const itemSubsector = (item.subsector || '').toLowerCase().trim();
        return categoryMatchKeywords.some(keyword =>
          itemSector.includes(keyword.toLowerCase()) ||
          itemSubsector.includes(keyword.toLowerCase())
        );
      });

      return {
        id: company._id?.toString(),
        name: company.companyName,
        location: company.companyAddress || company.postCode || (Array.isArray(company.regions) ? company.regions.join(', ') : ''),
        rating: 4.7,
        specialties: Array.isArray(company.industrySector) ? company.industrySector.slice(0, 3) : [],
        description: company.productsServices || '',
        image: company.companyLogo ? `${req.protocol}://${req.get('host')}${company.companyLogo}` : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
        contact: {
          phone: company.contactPerson?.phoneNumber || '',
          email: company.contactPerson?.email || '',
        },
        hierarchicalProductsServices: company.hierarchicalProductsServices || {},
        productsServiceCategories: company.productsServiceCategories || [],
        mainSector: company.mainSector,
        productsServices: matchingProducts,
        tabs: company.tabs
      };
    });

    res.json({
      success: true,
      data: formattedCompanies,
      count: formattedCompanies.length,
      filters: { category, subtopic, topic }
    });

  } catch (error) {
    console.error('Error fetching companies by hierarchical category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get companies by multiple categories (for complex filtering)
router.post('/by-categories', async (req, res) => {
  try {
    const { categories } = req.body; // Array of category objects with optional subtopics and topics

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categories array is required'
      });
    }

    const companies = await getAllCompanies();

    let filteredCompanies = companies.filter(company => {
      // Exclude archived companies
      if ((company.status || 'Active') === 'Archived') return false;
      if (!company.hierarchicalProductsServices) return false;

      return categories.some(filter => {
        const { category, subtopic, topic } = filter;

        // Check if company has the main category
        if (!company.hierarchicalProductsServices[category]) return false;

        // If subtopic is specified, check if company has it
        if (subtopic) {
          if (!company.hierarchicalProductsServices[category][subtopic]) return false;

          // If topic is specified, check if company has it
          if (topic) {
            const topics = company.hierarchicalProductsServices[category][subtopic];
            if (!Array.isArray(topics) || !topics.includes(topic)) return false;
          }
        }

        return true;
      });
    });

    // Return public information for filtered companies
    const publicCompanies = filteredCompanies.map(company => ({
      id: company._id?.toString(),
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      postCode: company.postCode,
      industrySector: company.industrySector,
      mainSector: company.mainSector || null,
      productsServiceCategories: company.productsServiceCategories || [],
      hierarchicalProductsServices: company.hierarchicalProductsServices || {},
      productsServices: company.productsServices,
      companyBio: company.companyBio || null,
      companyNews: company.companyNews || [],
      isRecruitmentCompany: company.isRecruitmentCompany,
      regions: company.regions,
      contactPerson: {
        firstName: company.contactPerson?.firstName,
        lastName: company.contactPerson?.lastName,
        role: company.contactPerson?.role,
        email: company.contactPerson?.email,
        phoneNumber: company.contactPerson?.phoneNumber,
      },
      profileCompletion: company.profileCompletion,
      createdAt: company.createdAt
    }));

    res.json({
      success: true,
      data: publicCompanies,
      count: publicCompanies.length,
      filters: categories
    });

  } catch (error) {
    console.error('Error fetching companies by categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get products/services by category
router.get('/products-services/by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { subtopic, topic } = req.query;

    console.log(`\n[products-services-by-category] === FETCHING FOR CATEGORY: ${category} ===`);

    const companies = await getAllCompanies();
    console.log(`[products-services-by-category] Total companies: ${companies.length}`);

    // Filter out archived companies
    const activeCompanies = companies.filter(c => (c.status || 'Active') !== 'Archived');

    let allProductsServices = [];

    activeCompanies.forEach(company => {
      const items = company?.tabs?.productsServices?.items;
      if (!Array.isArray(items)) return;

      items.forEach(item => {
        // Check if item matches the category
        const itemSector = (item.sector || '').toLowerCase().trim();
        const itemSubsector = (item.subsector || '').toLowerCase().trim();

        // Build category matches
        const getCategoryMatches = (cat) => {
          const map = {
            'renewable-energy': ['renewable-energy', 'renewable energy', 'renewable'],
            'sustainable-esg-net-zero': ['sustainable-esg-net-zero', 'sustainable-esg-netzero', 'sustainable / esg / net zero', 'sustainable/esg/net zero', 'sustainable', 'esg', 'net zero'],
            'energy-management': ['energy-management', 'energy management'],
            'company-wellness': ['company-wellness', 'company wellness'],
            'it-related-services': ['it-related-services', 'it related service', 'it related services', 'it', 'cloud solutions', 'cybersecurity', 'managed it'],
            'job-recruitment': ['job-recruitment', 'jobs-recruitment', 'jobs & recruitment', 'jobs and recruitment', 'recruitment', 'job recruitment'],
            'finance-funding': ['finance-funding', 'finance & funding', 'finance and funding', 'finance', 'funding'],
            'eco-friendly-passivhaus': ['eco-friendly-passivhaus', 'eco friendly / passivhaus', 'eco friendly', 'passivhaus'],
            'utility-provision-civils': ['utility-provision-civils', 'utility provision & civils', 'utility provision and civils', 'utility', 'civils'],
          };
          return map[cat] || [cat.toLowerCase()];
        };

        const categoryMatches = getCategoryMatches(category);

        const hasMatch = categoryMatches.some(keyword =>
          itemSector.includes(keyword.toLowerCase()) ||
          itemSubsector.includes(keyword.toLowerCase())
        );

        if (hasMatch) {
          console.log(`[products-services-by-category] Match found - Company: ${company.companyName}, Item: ${item.title}, Sector: ${item.sector}, Subsector: ${item.subsector}`);
          allProductsServices.push({
            id: company._id?.toString(),
            companyId: company._id?.toString(),
            companyName: company.companyName,
            companyLogo: company.companyLogo,
            companyAddress: company.companyAddress,
            mainSector: company.mainSector || null,
            item: item
          });
        }
      });
    });

    console.log(`[products-services-by-category] Found ${allProductsServices.length} products/services`);

    res.json({
      success: true,
      data: allProductsServices,
      count: allProductsServices.length,
      filters: { category, subtopic, topic }
    });

  } catch (error) {
    console.error('Error fetching products/services by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== CERTIFICATIONS ROUTES ====================

// Add certification to company
router.get("/:id/certifications", verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    const items = company.tabs?.certifications?.items || [];
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Error fetching certifications:", err);
    res.status(500).json({ success: false, message: "Failed to fetch certifications" });
  }
});

router.post('/:id/certifications', verifyToken, upload.fields([{name: 'images', maxCount: 10}, {name: 'certificateFile', maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, issueDate, expiryDate, issuingBody, category, certificationNumber } = req.body;

    if (!title || !description || !issueDate || !issuingBody) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, issue date, and issuing body are required'
      });
    }

    // Initialize tabs if not exists
    if (!company.tabs) {
      company.tabs = {};
    }
    if (!company.tabs.certifications) {
      company.tabs.certifications = { enabled: false, items: [] };
    }

    // Process uploaded images
    const images = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(file => `/uploads/${file.filename}`);

    // Add new certification
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      issueDate,
      expiryDate: expiryDate || '',
      issuingBody,
      category: category || '',
      certificationNumber: certificationNumber || '',
      images,
      createdAt: new Date().toISOString()
    };

    if (!company.tabs.certifications.items) {
      company.tabs.certifications.items = [];
    }

    company.tabs.certifications.items.push(newItem);
    company.tabs.certifications.enabled = true;

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Certification added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding certification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete certification from company
router.put("/:id/certifications/:itemId", verifyToken, upload.fields([{name: "images", maxCount: 10}, {name: "certificateFile", maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    if (!company.tabs?.certifications?.items) return res.status(404).json({ success: false, message: "No certifications found" });
    const idx = company.tabs.certifications.items.findIndex(i => i.id === req.params.itemId || i.id === parseInt(req.params.itemId));
    if (idx === -1) return res.status(404).json({ success: false, message: "Certification not found" });
    const { title, description, issueDate, expiryDate, issuingBody, category, certificationNumber } = req.body;
    const newImages = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(f => `/uploads/${f.filename}`);
    const existingImages = JSON.parse(req.body.existingImages || "[]");
    const item = company.tabs.certifications.items[idx];
    if (title) item.title = title;
    if (description) item.description = description;
    if (issueDate) item.issueDate = issueDate;
    if (expiryDate !== undefined) item.expiryDate = expiryDate;
    if (issuingBody) item.issuingBody = issuingBody;
    if (category !== undefined) item.category = category;
    if (certificationNumber !== undefined) item.certificationNumber = certificationNumber;
    item.images = [...existingImages, ...newImages];
    item.updatedAt = new Date().toISOString();
    await company.save();
    res.json({ success: true, data: item, message: "Certification updated" });
  } catch (err) {
    console.error("Error updating certification:", err);
    res.status(500).json({ success: false, message: "Failed to update certification" });
  }
});

router.delete('/:id/certifications/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { itemId } = req.params;

    if (!company.tabs?.certifications?.items) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    const items = company.tabs.certifications.items;
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    // Remove the item
    items.splice(itemIndex, 1);

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== AWARDS ROUTES ====================

// Add award to company
router.post('/:id/awards', verifyToken, upload.fields([{name: 'images', maxCount: 10}, {name: 'certificateFile', maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, awardDate, awardingBody, category, location, url } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Initialize tabs if not exists
    if (!company.tabs) {
      company.tabs = {};
    }
    if (!company.tabs.awards) {
      company.tabs.awards = { enabled: false, items: [] };
    }

    // Process uploaded images
    const images = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(file => `/uploads/${file.filename}`);

    // Add new award
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      awardDate: awardDate || '',
      awardingBody: awardingBody || '',
      category: category || '',
      location: location || '',
      url: url || '',
      images,
      createdAt: new Date().toISOString()
    };

    if (!company.tabs.awards.items) {
      company.tabs.awards.items = [];
    }

    company.tabs.awards.items.push(newItem);
    company.tabs.awards.enabled = true;

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Award added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding award:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete award from company
router.delete('/:id/awards/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { itemId } = req.params;

    if (!company.tabs?.awards?.items) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const items = company.tabs.awards.items;
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Remove the item
    items.splice(itemIndex, 1);

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Award deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== PROJECTS ROUTES ====================

// Add project to company
router.post('/:id/projects', verifyToken, upload.fields([{name: 'images', maxCount: 10}, {name: 'certificateFile', maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, workDelivered, outcome, descriptionVisibility, clientName, projectDate, projectValue, location, keyFeatures, url } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Initialize tabs if not exists
    if (!company.tabs) {
      company.tabs = {};
    }
    if (!company.tabs.projects) {
      company.tabs.projects = { enabled: false, items: [] };
    }

    // Process uploaded images
    const images = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(file => `/uploads/${file.filename}`);

    // Parse keyFeatures if string
    let parsedFeatures = [];
    try {
      parsedFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
    } catch (e) {
      parsedFeatures = [];
    }

    // Add new project
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      workDelivered: workDelivered || '',
      outcome: outcome || '',
      descriptionVisibility: descriptionVisibility || 'public',
      clientName: clientName || '',
      projectDate: projectDate || '',
      projectValue: projectValue || '',
      location: location || '',
      keyFeatures: parsedFeatures || [],
      url: url || '',
      images,
      createdAt: new Date().toISOString()
    };

    if (!company.tabs.projects.items) {
      company.tabs.projects.items = [];
    }

    company.tabs.projects.items.push(newItem);
    company.tabs.projects.enabled = true;

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Project added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete project from company
router.delete('/:id/projects/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { itemId } = req.params;

    if (!company.tabs?.projects?.items) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const items = company.tabs.projects.items;
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Remove the item
    items.splice(itemIndex, 1);

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== CASE STUDIES ROUTES ====================

// Add case study to company
router.post('/:id/case-studies', verifyToken, upload.fields([{name: 'images', maxCount: 10}, {name: 'certificateFile', maxCount: 1}]), async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, sector, subsector, challenge, solution, results, clientName, projectDate, projectValue, location, keyFeatures } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Initialize tabs if not exists
    if (!company.tabs) {
      company.tabs = {};
    }
    if (!company.tabs.caseStudies) {
      company.tabs.caseStudies = { enabled: false, items: [] };
    }

    // Process uploaded images
    const images = [...(req.files?.images || []), ...(req.files?.certificateFile || [])].map(file => `/uploads/${file.filename}`);

    // Parse keyFeatures if string
    let parsedFeatures = [];
    try {
      parsedFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
    } catch (e) {
      parsedFeatures = [];
    }

    // Add new case study
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      sector: sector || '',
      subsector: subsector || '',
      challenge: challenge || '',
      solution: solution || '',
      results: results || '',
      clientName: clientName || '',
      projectDate: projectDate || '',
      projectValue: projectValue || '',
      location: location || '',
      keyFeatures: parsedFeatures || [],
      images,
      createdAt: new Date().toISOString()
    };

    if (!company.tabs.caseStudies.items) {
      company.tabs.caseStudies.items = [];
    }

    company.tabs.caseStudies.items.push(newItem);
    company.tabs.caseStudies.enabled = true;

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Case study added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding case study:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete case study from company
router.delete('/:id/case-studies/:itemId', verifyToken, async (req, res) => {
  try {
    const company = await findCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user owns this company or is admin
    if (company.userId !== req.user.userId && company.createdByUserId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { itemId } = req.params;

    if (!company.tabs?.caseStudies?.items) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    const items = company.tabs.caseStudies.items;
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    // Remove the item
    items.splice(itemIndex, 1);

    // Update company
    await updateCompany(req.params.id, { tabs: company.tabs });

    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
