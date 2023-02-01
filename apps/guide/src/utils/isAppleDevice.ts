export function isAppleDevice() {
	return /(Mac|iPhone|iPod|iPad)/i.test(navigator?.userAgent ?? '');
}
