import type { INodePropertyOptions, IPostReceiveRootProperty } from 'n8n-workflow';

export const platformOptions: INodePropertyOptions[] = [
	{ name: 'Angi', value: 'angi' },
	{ name: 'Apartments.com', value: 'apartments' },
	{ name: 'App Store', value: 'app_store' },
	{ name: 'Avvo', value: 'avvo' },
	{ name: 'Booking.com', value: 'booking' },
	{ name: 'Capterra', value: 'capterra' },
	{ name: 'Checkatrade', value: 'checkatrade' },
	{ name: 'DoorDash', value: 'doordash' },
	{ name: 'eBay', value: 'ebay' },
	{ name: 'eKomi', value: 'ekomi' },
	{ name: 'Etsy', value: 'etsy' },
	{ name: 'Facebook', value: 'facebook' },
	{ name: 'Feefo', value: 'feefo' },
	{ name: 'G2', value: 'g2' },
	{ name: 'Google Business Profile', value: 'google' },
	{ name: 'Google Maps', value: 'google_maps' },
	{ name: 'Google Play', value: 'google_play' },
	{ name: 'Judge.me', value: 'judge_me' },
	{ name: 'Loox', value: 'loox' },
	{ name: 'Okendo', value: 'okendo' },
	{ name: 'OpenTable', value: 'opentable' },
	{ name: 'ProvenExpert', value: 'proven_expert' },
	{ name: 'REVIEWS.io', value: 'reviews_io' },
	{ name: 'Salesforce AppExchange', value: 'appexchange' },
	{ name: 'Shopper Approved', value: 'shopper_approved' },
	{ name: 'Steam', value: 'steam' },
	{ name: 'Tripadvisor', value: 'tripadvisor' },
	{ name: 'Trusted Shops', value: 'trusted_shops' },
	{ name: 'Trustpilot', value: 'trustpilot' },
	{ name: 'WordPress.org', value: 'wordpress' },
	{ name: 'Yelp', value: 'yelp' },
	{ name: 'Yotpo', value: 'yotpo' },
];

/** List endpoints wrap their items in `data`: emit one n8n item per element. */
export const unwrapData: IPostReceiveRootProperty = {
	type: 'rootProperty',
	properties: {
		property: 'data',
	},
};
