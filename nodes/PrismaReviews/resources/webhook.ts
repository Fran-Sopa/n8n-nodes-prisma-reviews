import type { INodeProperties } from 'n8n-workflow';
import { unwrapData } from '../shared/descriptions';
import { webhookEventOptions } from '../shared/webhookEvents';

const showForWebhook = { resource: ['webhook'] };

export const webhookDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForWebhook },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a webhook endpoint',
				description:
					'Register an HTTPS endpoint. The response includes the signing secret, which is shown only once.',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/webhooks',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a webhook endpoint',
				description: 'Delete a webhook endpoint; deliveries still pending for it are dropped',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/webhooks/{{encodeURIComponent($parameter.webhookId)}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many webhook endpoints',
				description: 'List the webhook endpoints of the workspace',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/webhooks',
					},
					output: {
						postReceive: [unwrapData],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'we_01KJ8R1A3B5C7D9E1F3G5H7J9K',
		description: 'The webhook endpoint ID (we_…)',
		displayOptions: { show: { resource: ['webhook'], operation: ['delete'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://yourapp.com/webhooks/prisma',
		description: 'Your endpoint. Must start with https://.',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		routing: { send: { type: 'body', property: 'url' } },
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		options: [{ name: 'All Events', value: '*' }, ...webhookEventOptions],
		default: ['*'],
		description: 'Event types to send to the endpoint',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		routing: { send: { type: 'body', property: 'events' } },
	},
];
