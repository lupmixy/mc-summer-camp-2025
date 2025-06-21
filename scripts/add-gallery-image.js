const fs = require('fs');
const path = require('path');

function addImageToGallery(imageName) {
  const galleryApiPath = path.join(__dirname, '..', 'api', 'gallery.ts');
  
  try {
    // Read the current gallery API file
    let content = fs.readFileSync(galleryApiPath, 'utf8');
    
    // Find the mediaFiles array
    const customImagesComment = '// Custom images';
    const customImagesIndex = content.indexOf(customImagesComment);
    
    if (customImagesIndex === -1) {
      console.error('Could not find "// Custom images" comment in gallery.ts');
      process.exit(1);
    }
    
    // Find the line after the comment where we should add the new image
    const insertPosition = content.indexOf('\n', customImagesIndex) + 1;
    const beforeInsert = content.substring(0, insertPosition);
    const afterInsert = content.substring(insertPosition);
    
    // Add the new image
    const newImageLine = `      '${imageName}',\n`;
    const newContent = beforeInsert + newImageLine + afterInsert;
    
    // Write back to file
    fs.writeFileSync(galleryApiPath, newContent);
    
    console.log(`✅ Added '${imageName}' to gallery API`);
    console.log(`📝 File updated: ${galleryApiPath}`);
    console.log(`🔄 Don't forget to commit and push the changes!`);
    
  } catch (error) {
    console.error('❌ Error updating gallery API:', error.message);
    process.exit(1);
  }
}

// Get image name from command line argument
const imageName = process.argv[2];

if (!imageName) {
  console.log('Usage: node scripts/add-gallery-image.js <image-filename>');
  console.log('Example: node scripts/add-gallery-image.js new-photo.jpg');
  process.exit(1);
}

// Check if image exists in gallery directory
const imagePath = path.join(__dirname, '..', 'public', 'media', 'gallery', imageName);
if (!fs.existsSync(imagePath)) {
  console.log(`⚠️  Warning: Image file not found at ${imagePath}`);
  console.log('   Make sure to copy the image file to public/media/gallery/ first');
}

addImageToGallery(imageName);
