import Terms from '../models/Terms.js';

// Get terms and conditions
export const getTerms = async (req, res) => {
    console.log('Received request to fetch terms and conditions.');
    try {
        const terms = await Terms.findOne();
        if (terms) {
            console.log('Terms found:', terms);
        } else {
            console.log('No terms found in the database.');
        }
        res.json(terms);
    } catch (err) {
        console.error('Error fetching terms:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Update terms and conditions (Admin only)
export const updateTerms = async (req, res) => {
    console.log('Received request to update terms and conditions.');
    const { content } = req.body;
    console.log('Request body content:', content);
    
    try {
        let terms = await Terms.findOne();
        if (terms) {
            console.log('Existing terms found. Updating terms...');
            terms.content = content;
            terms.lastUpdated = Date.now();
            await terms.save();
            console.log('Terms updated successfully.');
        } else {
            console.log('No existing terms found. Creating new terms...');
            terms = new Terms({ content });
            await terms.save();
            console.log('New terms created successfully.');
        }
        res.json(terms);
    } catch (err) {
        console.error('Error updating terms:', err.message);
        res.status(500).json({ message: err.message });
    }
};
