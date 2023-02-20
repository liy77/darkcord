export function isAppleDevice() {
	return /mac|iphone|ipod|ipad/i.test(navigator?.userAgent ?? '');
}