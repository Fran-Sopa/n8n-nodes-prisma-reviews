import type { INodePropertyOptions } from 'n8n-workflow';

export const webhookEventOptions: INodePropertyOptions[] = [
	{
		name: 'Connection Updated',
		value: 'connection.updated',
		description: 'An OAuth connection became active, or a connection needs to be re-authorized',
	},
	{
		name: 'Reply Failed',
		value: 'reply.failed',
		description: 'The platform refused a reply, or every retry failed',
	},
	{
		name: 'Reply Published',
		value: 'reply.published',
		description: 'A reply sent through Prisma is live on the platform',
	},
	{
		name: 'Reply Unknown',
		value: 'reply.unknown',
		description: 'A reply was sent but the platform never answered and it cannot be read back, so Prisma stopped without retrying: check the review on the platform',
	},
	{
		name: 'Review Created',
		value: 'review.created',
		description: 'A new review was found on a connected location',
	},
	{
		name: 'Review Updated',
		value: 'review.updated',
		description: "A review's content changed, or a reply appeared or changed on the platform",
	},
];
