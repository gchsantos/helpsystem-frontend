export function setWithExpiry(key, value, ttl=1800000) {
	const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) {
		return 0;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key);
		return -1;
	}
	return item.value;
}

export function removeItem(key) {
	console.log('a')
	localStorage.removeItem(key);
}