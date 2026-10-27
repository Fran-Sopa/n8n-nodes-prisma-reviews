import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { connectionDescription } from './resources/connection';
import { connectLinkDescription } from './resources/connectLink';
import { locationDescription } from './resources/location';
import { platformDescription } from './resources/platform';
import { replyDescription } from './resources/reply';
import { reviewDescription } from './resources/review';
import { usageDescription } from './resources/usage';
import { webhookDescription } from './resources/webhook';

export class PrismaReviews implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Prisma Reviews',
		name: 'prismaReviews',
		icon: {
			light: 'file:../../icons/prismaReviews.svg',
			dark: 'file:../../icons/prismaReviews.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Read and reply to reviews from the App Store, Google Play, Yelp, Tripadvisor and more with the Prisma Reviews API',
		defaults: {
			name: 'Prisma Reviews',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'prismaReviewsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.prismareviews.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Connect Link', value: 'connectLink' },
					{ name: 'Connection', value: 'connection' },
					{ name: 'Location', value: 'location' },
					{ name: 'Platform', value: 'platform' },
					{ name: 'Reply', value: 'reply' },
					{ name: 'Review', value: 'review' },
					{ name: 'Usage', value: 'usage' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'review',
			},
			...reviewDescription,
			...replyDescription,
			...locationDescription,
			...connectionDescription,
			...connectLinkDescription,
			...platformDescription,
			...usageDescription,
			...webhookDescription,
		],
	};
}
