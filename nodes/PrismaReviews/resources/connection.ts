import type { INodeProperties } from 'n8n-workflow';
import { platformOptions, unwrapData } from '../shared/descriptions';

const showForConnection = { resource: ['connection'] };
const showForCreate = { resource: ['connection'], operation: ['create'] };

export const connectionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForConnection },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a connection',
				description:
					'Connect a platform account. OAuth platforms return an authorization URL for the owner; with a test key any platform connects with sample data.',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/connections',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a connection',
				description: 'Disconnect a platform account and its locations',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/connections/{{encodeURIComponent($parameter.connectionId)}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many connections',
				description: 'List many connections of the workspace',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/connections',
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
		displayName: 'Connection ID',
		name: 'connectionId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'con_01KJ8P7R5S3T1V9W7X5Y3Z1A2B',
		description: 'The connection ID (con_…)',
		displayOptions: { show: { resource: ['connection'], operation: ['delete'] } },
	},
	{
		displayName: 'Platform',
		name: 'platform',
		type: 'options',
		required: true,
		options: platformOptions,
		default: 'google',
		description:
			'Platform to connect. Use Platform > Get to see whether it needs a redirect URL, credentials or a listing URL.',
		displayOptions: { show: showForCreate },
		routing: { send: { type: 'body', property: 'platform' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showForCreate },
		options: [
			{
				displayName: 'Credentials (JSON)',
				name: 'credentials',
				type: 'json',
				default: '{}',
				description:
					'Required for platforms that connect with credentials, and for Trustpilot (domain). The fields of each platform are listed by Platform > Get.',
				routing: {
					send: {
						type: 'body',
						property: 'credentials',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Listing URL',
				name: 'listing_url',
				type: 'string',
				default: '',
				placeholder: 'https://www.yelp.com/biz/example-cafe-san-francisco',
				description:
					'Required for platforms that connect with a listing URL: the public page of the listing',
				routing: { send: { type: 'body', property: 'listing_url' } },
			},
			{
				displayName: 'Metadata (JSON)',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Your own key-value pairs, for example your client ID',
				routing: {
					send: {
						type: 'body',
						property: 'metadata',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Redirect URL',
				name: 'redirect_url',
				type: 'string',
				default: '',
				placeholder: 'https://yourapp.com/prisma/callback',
				description:
					'Required for OAuth platforms with a live key: where the owner lands after approving, with connection_id and status in the query string',
				routing: { send: { type: 'body', property: 'redirect_url' } },
			},
		],
	},
];
