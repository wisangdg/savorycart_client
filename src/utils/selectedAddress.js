/**
 * Penyimpanan alamat terpilih per pengguna.
 * Key diberi akhiran userId agar alamat tidak tertukar saat ganti akun.
 *
 * Nilai yang disimpan adalah snapshot objek alamat (dipakai Orders.jsx untuk
 * menampilkan alamat terpilih). `getSelectedAddressId` menjadi penanda pilihan
 * (id) yang konsisten dengan daftar alamat terbaru dari server.
 */

const KEY_PREFIX = "selectedAddress";

export const selectedAddressKey = (userId) =>
	userId ? `${KEY_PREFIX}:${userId}` : KEY_PREFIX;

export const getSelectedAddress = (userId) => {
	try {
		const raw = localStorage.getItem(selectedAddressKey(userId));
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

/** Id alamat terpilih, atau null bila belum ada / data rusak. */
export const getSelectedAddressId = (userId) => {
	const address = getSelectedAddress(userId);
	return address?._id ?? null;
};

export const saveSelectedAddress = (userId, address) => {
	try {
		localStorage.setItem(
			selectedAddressKey(userId),
			JSON.stringify(address),
		);
	} catch {
		// Storage penuh / diblokir: pilihan tidak persisten, bukan alasan gagal.
	}
};

export const clearSelectedAddress = (userId) => {
	localStorage.removeItem(selectedAddressKey(userId));
};
