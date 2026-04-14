import express from 'express';
import { getContent, updateContent } from '../database/db.js';

const router = express.Router();

// Get content for a specific section
router.get('/:section', async (req, res) => {
    try {
        const section = req.params.section;
        const data = await getContent(section);
        res.json({ success: true, data });
    } catch (error) {
        console.error(`Error getting content for ${req.params.section}:`, error);
        res.status(500).json({ success: false, error: 'Failed to fetch content' });
    }
});

// Update content for a specific section
router.post('/:section', async (req, res) => {
    try {
        const section = req.params.section;
        let data = req.body;

        // Validate we're sending an array if it's supposed to be an array
        if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, error: 'Data must be an array' });
        }

        // Convert any base64 images to files
        const { writeFileSync } = await import('fs');
        const imageFields = ['image', 'personImage', 'companyLogo', 'logo'];
        data = data.map((item, idx) => {
            if (!item || typeof item !== 'object') return item;
            const newItem = { ...item };
            for (const field of imageFields) {
                if (typeof newItem[field] === 'string' && newItem[field].startsWith('data:image')) {
                    const m = newItem[field].match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/s);
                    if (m) {
                        let ext = m[1];
                        if (ext === 'jpeg') ext = 'jpg';
                        if (ext === 'avif') ext = 'png';
                        const fname = `${section}-${field}-${item.id || idx}-${Date.now()}.${ext}`;
                        writeFileSync(`/app/uploads/${fname}`, Buffer.from(m[2], 'base64'));
                        newItem[field] = `/uploads/${fname}`;
                    }
                }
            }
            return newItem;
        });

        const updatedData = await updateContent(section, data);
        return res.json({ success: true, data: updatedData });
    } catch (error) {
        console.error(`Error updating content for ${req.params.section}:`, error);
        return res.status(500).json({ success: false, error: 'Failed to update content' });
    }
});

// Get all content (optional, if needed)
router.get('/', async (req, res) => {
    try {
        const data = await getContent();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error getting all content:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch content' });
    }
});

export default router;
