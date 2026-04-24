/**
 * Template JSDoc untuk komponen React
 * 
 * @module JSDocTemplates
 */

/**
 * Template untuk komponen React
 * 
 * @typedef {Object} ComponentProps
 * @property {string} propName - Deskripsi prop
 * @property {function} callbackProp - Fungsi callback
 * @property {React.ReactNode} children - Children dari komponen
 * 
 * @example
 * // Contoh penggunaan komponen
 * <Component propName="value" callbackProp={() => {}} />
 */

/**
 * Template untuk custom hook
 * 
 * @typedef {Object} HookResult
 * @property {any} value - Nilai yang dikembalikan hook
 * @property {function} setValue - Fungsi untuk mengubah nilai
 * @property {boolean} loading - Status loading
 * @property {Error|null} error - Error jika ada
 * 
 * @example
 * // Contoh penggunaan hook
 * const { value, setValue, loading, error } = useCustomHook();
 */

/**
 * Template untuk fungsi utility
 * 
 * @param {any} param - Parameter fungsi
 * @returns {any} - Nilai yang dikembalikan fungsi
 * @throws {Error} - Error yang mungkin terjadi
 * 
 * @example
 * // Contoh penggunaan fungsi
 * const result = utilityFunction(param);
 */

/**
 * Template untuk context provider
 * 
 * @typedef {Object} ContextValue
 * @property {any} value - Nilai context
 * @property {function} setValue - Fungsi untuk mengubah nilai context
 * 
 * @example
 * // Contoh penggunaan context
 * const { value, setValue } = useContext(Context);
 */

/**
 * Template untuk reducer
 * 
 * @typedef {Object} State
 * @property {any} property - Property state
 * 
 * @typedef {Object} Action
 * @property {string} type - Tipe action
 * @property {any} payload - Payload action
 * 
 * @example
 * // Contoh penggunaan reducer
 * const [state, dispatch] = useReducer(reducer, initialState);
 * dispatch({ type: 'ACTION_TYPE', payload: data });
 */

// Export template untuk digunakan di file lain
export const templates = {
  component: '/**\n * Deskripsi komponen\n * \n * @component\n * @param {Object} props - Props komponen\n * @param {string} props.propName - Deskripsi prop\n * @returns {React.ReactElement} Komponen React\n */\n',
  hook: '/**\n * Custom hook untuk [deskripsi]\n * \n * @returns {Object} Object berisi state dan methods\n */\n',
  utility: '/**\n * Fungsi untuk [deskripsi]\n * \n * @param {any} param - Deskripsi parameter\n * @returns {any} Deskripsi return value\n */\n',
  context: '/**\n * Context untuk [deskripsi]\n * \n * @type {React.Context}\n */\n',
  reducer: '/**\n * Reducer untuk [deskripsi]\n * \n * @param {Object} state - State saat ini\n * @param {Object} action - Action yang dipanggil\n * @param {string} action.type - Tipe action\n * @param {any} action.payload - Payload action\n * @returns {Object} State baru\n */\n'
};

// Contoh penggunaan
// Salin template yang sesuai dan tempel di atas komponen/fungsi/hook
