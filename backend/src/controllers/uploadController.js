const path = require('path');
const fs = require('fs');

// Get uploaded file info
const getFileInfo = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier téléchargé'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Fichier téléchargé avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });

  } catch (error) {
    console.error('Erreur getFileInfo:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du traitement du fichier'
    });
  }
};

// Delete uploaded file
const deleteFile = (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Nom de fichier requis'
      });
    }

    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteFile:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du fichier'
    });
  }
};

module.exports = {
  getFileInfo,
  deleteFile
};
