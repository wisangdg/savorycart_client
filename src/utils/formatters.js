/**
 * Format price to Indonesian Rupiah format
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
  return price.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Format date to Indonesian format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
