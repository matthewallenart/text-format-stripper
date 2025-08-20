// Show the UI
figma.showUI(__html__, { width: 400, height: 600 });

// Handle messages from the UI
figma.ui.onmessage = function(msg) {
  console.log('Plugin received message:', msg);
  
  if (msg.type === 'strip-text') {
    try {
      console.log('Processing text:', msg.text);
      // Process the text to remove formatting
      const cleanText = stripFormattingFromText(msg.text);
      console.log('Cleaned text:', cleanText);
      
      figma.ui.postMessage({
        type: 'text-stripped',
        text: cleanText
      });
    } catch (error) {
      console.error('Error processing text:', error);
      figma.ui.postMessage({
        type: 'error',
        message: 'Failed to process text'
      });
    }
  }
};

function stripFormattingFromText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  console.log('Input text length:', text.length);
  
  // Remove HTML tags
  let cleanText = text.replace(/<[^>]*>/g, '');
  
  // Remove common markdown formatting
  cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // Italic
  cleanText = cleanText.replace(/__(.*?)__/g, '$1'); // Bold
  cleanText = cleanText.replace(/_(.*?)_/g, '$1'); // Italic
  cleanText = cleanText.replace(/`(.*?)`/g, '$1'); // Code
  cleanText = cleanText.replace(/~~(.*?)~~/g, '$1'); // Strikethrough
  
  // Remove links but keep text
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove headers
  cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');
  
  // Remove list markers
  cleanText = cleanText.replace(/^\s*[-*+]\s+/gm, '');
  cleanText = cleanText.replace(/^\s*\d+\.\s+/gm, '');
  
  // Remove block quotes
  cleanText = cleanText.replace(/^\s*>\s+/gm, '');
  
  // Clean up extra whitespace
  cleanText = cleanText.replace(/\n\s*\n/g, '\n\n'); // Multiple newlines to double
  cleanText = cleanText.trim();
  
  console.log('Output text length:', cleanText.length);
  return cleanText;
}