import Flashcard from '../models/Flashcard.js';

/**
 * @desc Get flashcards for a specific document
 * @route GET /api/flashcards/:documentId
 * @access Private
 */
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
      message: 'Flashcards retrieved successfully',
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all flashcards sets for a user
 * @route GET /api/flashcards
 * @access Private
 */
export const getAllFlashcardsSet = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({ userId: req.user._id })
      .populate('documentId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
      message: 'Flashcards sets retrieved successfully',
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Mark a flashcard as reviewed
 * @route POST /api/flashcards/:cardId/review
 * @access Private
 */
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set not found',
        statusCode: 404
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found',
        statusCode: 404
      });
    }

    flashcardSet.cards[cardIndex].lastReviewed = new Date();
    flashcardSet.cards[cardIndex].reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcard marked as reviewed successfully',
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle star/favorite status of a flashcard
 * @route PUT /api/flashcards/:cardId/star
 * @access Private
 */
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set not found',
        statusCode: 404
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found',
        statusCode: 404
      });
    }

    flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard marked as ${flashcardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'} successfully`,
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a flashcard set
 * @route DELETE /api/flashcards/:id
 * @access Private
 */
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcard set deleted successfully',
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};
