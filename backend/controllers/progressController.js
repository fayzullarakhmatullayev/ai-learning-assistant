import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

/**
 * @desc Get dashboard stats
 * @route GET /api/progress/dashboard
 * @access Private
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [
      totalDocuments,
      recentDocuments,
      totalFlashcardSets,
      flashcardSets,
      totalQuizzes,
      completedQuizzes,
      quizzes,
      recentQuizzes
    ] = await Promise.all([
      Document.countDocuments({ userId }),
      Document.find({ userId })
        .sort({ lastAccessed: -1 })
        .limit(5)
        .select('title fileName lastAccessed status'),
      Flashcard.countDocuments({ userId }),
      Flashcard.find({ userId }),
      Quiz.countDocuments({ userId }),
      Quiz.countDocuments({ userId, completedAt: { $ne: null } }),
      Quiz.find({ userId, completedAt: { $ne: null } }),
      Quiz.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('documentId', 'title')
        .select('title score totalQuestions completedAt')
    ]);

    // Get flaskcards statistics
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter((c) => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter((c) => c.isStarred).length;
    });

    // Get quiz statistics
    const avarageScore =
      quizzes > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0;

    // Study streak (simplified - in production, track daily activity)
    const studyStreak = Math.floor(Math.random() * 7) + 1;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          avarageScore,
          studyStreak
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
