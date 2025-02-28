const express = require('express');
const router = express.Router();
const Candidate = require('./models/candidates');
const User = require('./models/user');
const { authMiddleware } = require('./jwt');

const checkAdmin = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user && user.role === 'admin';
    } catch (err) {
        return false;
    }
};

// Create a new candidate (Admin-only)
router.post('/signup', authMiddleware, async (req, res) => {
    try {
        if (!(await checkAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin privileges' });
        }
        const newCandidate = new Candidate(req.body);
        const savedCandidate = await newCandidate.save();

        return res.status(200).json({ response: savedCandidate });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save candidate' });
    }
});

// Update candidate details (Admin-only)
router.put('/:candidateId', authMiddleware, async (req, res) => {
    try {
        if (!(await checkAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin privileges' });
        }
        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update candidate' });
    }
});

// Delete a candidate (Admin-only)
router.delete('/:candidateID', authMiddleware, async (req, res) => {
    try {
        if (!(await checkAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin privileges' });
        }

        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        return res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Voting logic
router.post('/vote/:candidateID', authMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVoted) {
            return res.status(400).json({ message: 'You already voted' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Admin cannot vote' });
        }

        // Voting logic
        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        return res.status(200).json({ message: 'You voted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        const record = candidates.map((data) => {
            return {
                name: data.name,
                party: data.party,
                voteCount: data.voteCount,
                id: data.id
            };
        });
        return res.status(200).json(record);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Failed to retrieve candidates' });
    }
});

// View election results
router.get('/result', async (req, res) => {
    try {
        const candidates = await Candidate.find();

        if (candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found' });
        }

        // Check if all candidates have zero votes
        let maxVotes = 0;
        const winners = [];

        candidates.forEach(candidate => {
            if (candidate.voteCount > maxVotes) {
                maxVotes = candidate.voteCount;
                winners.length = 0; // Clear previous winners
                winners.push(candidate);
            } else if (candidate.voteCount === maxVotes) {
                winners.push(candidate);
            }
        });

        if (maxVotes === 0) {
            return res.status(200).json({ message: 'No votes have been cast yet' });
        }

        if (winners.length > 1) {
            // Handle tie condition
            const result = winners.map(winner => ({
                name: winner.name,
                party: winner.party,
                votes: winner.voteCount,
            }));
            return res.status(200).json({
                message: 'There is a tie between the following candidates',
                winners: result,
            });
        }

        // Declare a single winner
        const winner = winners[0];
        return res.status(200).json({
            message: 'Election result',
            winner: {
                name: winner.name,
                party: winner.party,
                votes: winner.voteCount,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to retrieve results' });
    }
});


module.exports = router;
