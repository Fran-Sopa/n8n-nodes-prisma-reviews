import type { INodeProperties } from 'n8n-workflow';

export const usageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['usage'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get usage',
				description: "Get the plan, this month's requests and replies, and location usage",
				routing: {
					request: {
						method: 'GET',
						url: '/v1/usage',
					},
				},
			},
		],
		default: 'get',
	},
];
