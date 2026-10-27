import type { INodeProperties } from 'n8n-workflow';

const showForReply = { resource: ['reply'] };

export const replyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForReply },
		options: [
			{
				name: 'Create or Replace',
				value: 'create',
				action: 'Create or replace a reply',
				description:
					'Publish a reply to a review, replacing the current one if there is one. Returns the review with the reply queued.',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/reviews/{{encodeURIComponent($parameter.reviewId)}}/reply',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a reply',
				description: 'Delete the reply of a review',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/reviews/{{encodeURIComponent($parameter.reviewId)}}/reply',
					},
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Review ID',
		name: 'reviewId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'rev_01KJ8Q2M4T7HX3VB9CWD6NRZ5E',
		description: 'The ID of the review to reply to (rev_…)',
		displayOptions: { show: showForReply },
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		description:
			"Reply text, 1 to 10,000 characters. The platform's own limit also applies (for example Google Play 350 characters).",
		displayOptions: { show: { resource: ['reply'], operation: ['create'] } },
		routing: { send: { type: 'body', property: 'text' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['reply'], operation: ['create'] } },
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'A unique value per reply (a UUID works). Sending the same key with the same request again returns the stored response instead of replying twice.',
				routing: {
					request: {
						headers: {
							'Idempotency-Key': '={{ $value }}',
						},
					},
				},
			},
		],
	},
];
