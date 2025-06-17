// js/voucherManager.js

const MAX_SAVED_VOUCHERS = 5;
const VOUCHERS_STORAGE_KEY = 'savedVouchers';

/**
 * Saves a voucher (username and speed) to localStorage.
 * Manages a list of up to MAX_SAVED_VOUCHERS, removing the oldest if the limit is exceeded.
 * @param {string} username - The username of the voucher.
 * @param {string} speedValue - The selected speed value.
 */
function saveVoucher(username, speedValue) {
    if (!username || !speedValue) {
        console.error('Username or speedValue is missing, cannot save voucher.');
        return;
    }

    let vouchers = getSavedVouchers();

    // Check if voucher with the same username already exists, remove it to update its position and lastUsed time
    vouchers = vouchers.filter(v => v.username !== username);

    const newVoucher = {
        username: username,
        speed: speedValue,
        lastUsed: new Date().toISOString()
    };

    // Add the new voucher to the beginning of the array (most recently used)
    vouchers.unshift(newVoucher);

    // Keep only the N most recent vouchers
    if (vouchers.length > MAX_SAVED_VOUCHERS) {
        vouchers = vouchers.slice(0, MAX_SAVED_VOUCHERS);
    }

    try {
        localStorage.setItem(VOUCHERS_STORAGE_KEY, JSON.stringify(vouchers));
        console.log('Voucher saved:', newVoucher);
        console.log('All saved vouchers:', vouchers);
    } catch (e) {
        console.error('Failed to save vouchers to localStorage:', e);
    }
}

/**
 * Retrieves all saved vouchers from localStorage.
 * @returns {Array<Object>} An array of voucher objects, or an empty array if none are found or an error occurs.
 */
function getSavedVouchers() {
    try {
        const vouchersJson = localStorage.getItem(VOUCHERS_STORAGE_KEY);
        if (vouchersJson) {
            return JSON.parse(vouchersJson);
        }
    } catch (e) {
        console.error('Failed to retrieve vouchers from localStorage:', e);
    }
    return []; // Return empty array if nothing found or error
}

/**
 * Deletes a specific voucher by username from localStorage.
 * @param {string} username - The username of the voucher to delete.
 */
function deleteVoucher(username) {
    if (!username) {
        console.error('Username is missing, cannot delete voucher.');
        return;
    }

    let vouchers = getSavedVouchers();
    const initialLength = vouchers.length;
    vouchers = vouchers.filter(voucher => voucher.username !== username);

    if (vouchers.length < initialLength) {
        try {
            localStorage.setItem(VOUCHERS_STORAGE_KEY, JSON.stringify(vouchers));
            console.log('Voucher deleted for username:', username);
        } catch (e) {
            console.error('Failed to save updated vouchers to localStorage after deletion:', e);
        }
    } else {
        console.log('No voucher found with username to delete:', username);
    }
}

/**
 * Clears all saved vouchers from localStorage.
 */
function clearAllSavedVouchers() {
    try {
        localStorage.removeItem(VOUCHERS_STORAGE_KEY);
        console.log('All saved vouchers have been cleared.');
    } catch (e) {
        console.error('Failed to clear vouchers from localStorage:', e);
    }
}
