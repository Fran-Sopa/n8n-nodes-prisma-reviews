import type { INodeProperties } from 'n8n-workflow';
import { platformOptions } from '../shared/descriptions';

const showForConnectLink = { resource: ['connectLink'] };

export const connectLinkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForConnectLink },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a connect link',
				description:
					'Create a hosted link (valid 7 days) where an account owner connects their platform account themselves',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/connect_links',
						body: {},
					},
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['connectLink'], operation: ['create'] } },
		options: [
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: platformOptions,
				default: 'google',
				description:
					'Only this platform. Without it, the owner chooses among the platforms of your plan.',
				routing: { send: { type: 'body', property: 'platform' } },
			},
			{
				displayName: 'Redirect URL',
				name: 'redirect_url',
				type: 'string',
				default: '',
				placeholder: 'https://yourapp.com/connected',
				description:
					'Where to send the owner when they are done, with connection_id and status added to the query string. Must start with https://.',
				routing: { send: { type: 'body', property: 'redirect_url' } },
			},
		],
	},
];
