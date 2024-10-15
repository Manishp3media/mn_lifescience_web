import Terms from '../models/Terms.js';

// Get terms and conditions
export const getTerms = async (req, res) => {
    try {
        const terms = await Terms.findOne();
        res.json(terms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update terms and conditions (Admin only)
export const updateTerms = async (req, res) => {
    const { content } = req.body;
    try {
        let terms = await Terms.findOne();
        if (terms) {
            terms.content = content;
            terms.lastUpdated = Date.now();
            await terms.save();
        } else {
            terms = new Terms({ content });
            await terms.save();
        }
        res.json(terms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
