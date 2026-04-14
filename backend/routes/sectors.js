import express from 'express';
import { updateUser, findUserById, getAllUsers } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Update company sectors
router.put('/update-sectors', verifyToken, async (req, res) => {
  try {
    const { subsectors, mainSectors, sectors } = req.body;
    const userId = req.user.userId;

    // Support both old format (sectors) and new format (subsectors + mainSectors)
    const selectedSubsectors = subsectors || sectors || [];
    const selectedMainSectors = mainSectors || [];

    if (!Array.isArray(selectedSubsectors)) {
      return res.status(400).json({
        error: 'Sectors must be an array',
      });
    }

    // Update user with selected sectors
    const updatedUser = await updateUser(userId, {
      industrySectors: selectedSubsectors,
      mainSectors: selectedMainSectors,
      sectorUpdatedAt: new Date().toISOString(),
    });

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      message: 'Sectors updated successfully',
      subsectors: updatedUser.industrySectors,
      mainSectors: updatedUser.mainSectors || [],
    });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    console.error('Error updating sectors:', error);
    res.status(500).json({
      error: 'Failed to update sectors',
      message: error.message,
    });
  }
});

// Get companies by main sector
router.get('/by-main-sector/:mainSector', async (req, res) => {
  try {
    const { mainSector } = req.params;
    const decodedMainSector = decodeURIComponent(mainSector);

    // Find all companies that have this main sector
    const users = await getAllUsers();
    const companiesInMainSector = users.filter(user => 
      user.mainSectors && 
      user.mainSectors.includes(decodedMainSector)
    ).map(user => ({
      id: user._id?.toString(),
      username: user.username,
      email: user.email,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      postCode: user.postCode,
      regions: user.regions || [],
      subsectors: user.industrySectors || [],
      mainSectors: user.mainSectors || [],
      createdAt: user.createdAt,
    }));

    res.json({
      mainSector: decodedMainSector,
      count: companiesInMainSector.length,
      companies: companiesInMainSector,
    });
  } catch (error) {
    console.error('Error fetching companies by main sector:', error);
    res.status(500).json({
      error: 'Failed to fetch companies',
      message: error.message,
    });
  }
});

// Get companies by subsector
router.get('/by-sector/:sectorName', async (req, res) => {
  try {
    const { sectorName } = req.params;
    const decodedSector = decodeURIComponent(sectorName);

    // Find all companies that have this subsector
    const users = await getAllUsers();
    const companiesInSector = users.filter(user => 
      user.industrySectors && 
      user.industrySectors.includes(decodedSector)
    ).map(user => ({
      id: user._id?.toString(),
      username: user.username,
      email: user.email,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      postCode: user.postCode,
      regions: user.regions || [],
      subsectors: user.industrySectors || [],
      mainSectors: user.mainSectors || [],
      createdAt: user.createdAt,
    }));

    res.json({
      sector: decodedSector,
      count: companiesInSector.length,
      companies: companiesInSector,
    });
  } catch (error) {
    console.error('Error fetching companies by sector:', error);
    res.status(500).json({
      error: 'Failed to fetch companies',
      message: error.message,
    });
  }
});

// Get all sectors with company counts
router.get('/all-sectors', async (req, res) => {
  try {
    // Collect all unique sectors and count companies
    const sectorMap = {};

    const users = await getAllUsers();
    users.forEach(user => {
      if (user.industrySectors && Array.isArray(user.industrySectors)) {
        user.industrySectors.forEach(sector => {
          if (!sectorMap[sector]) {
            sectorMap[sector] = {
              name: sector,
              count: 0,
              companies: [],
            };
          }
          sectorMap[sector].count++;
          sectorMap[sector].companies.push({
            id: user._id?.toString(),
            companyName: user.companyName,
            username: user.username,
          });
        });
      }
    });

    const sectors = Object.values(sectorMap).sort((a, b) => b.count - a.count);

    res.json({
      totalSectors: sectors.length,
      sectors,
    });
  } catch (error) {
    console.error('Error fetching all sectors:', error);
    res.status(500).json({
      error: 'Failed to fetch sectors',
      message: error.message,
    });
  }
});

// Get user's selected sectors
router.get('/my-sectors', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      sectors: user.industrySectors || [],
      companyName: user.companyName,
    });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    console.error('Error fetching user sectors:', error);
    res.status(500).json({
      error: 'Failed to fetch sectors',
      message: error.message,
    });
  }
});

export default router;
