/**
 * Utility to detect keyboard navigation and add appropriate class to body
 */

export const setupKeyboardNavigation = () => {
  // Create keyboard focus indicator element
  const indicator = document.createElement('div');
  indicator.className = 'keyboard-focus-indicator';
  document.body.appendChild(indicator);
  
  let usingKeyboard = false;
  
  // Function to handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      usingKeyboard = true;
      document.body.classList.add('keyboard-navigation');
    }
  };
  
  // Function to handle mouse navigation
  const handleMouseDown = () => {
    usingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
  };
  
  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
    if (document.body.contains(indicator)) {
      document.body.removeChild(indicator);
    }
  };
};

export default setupKeyboardNavigation;
