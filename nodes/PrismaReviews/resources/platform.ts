import type { INodeProperties } from 'n8n-workflow';
import { platformOptions, unwrapData } from '../shared/descriptions';

const showForPlatform = { resource: ['platform'] };

export const platformDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForPlatform },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a platform',
				description:
					'Get how a platform connects, whether it supports replies and which credentials it needs',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/platforms/{{encodeURIComponent($parameter.platformId)}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many platforms',
				description: 'List many supported platforms and whether each one is ready',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/platforms',
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
		displayName: 'Platform',
		name: 'platformId',
		type: 'options',
		required: true,
		options: platformOptions,
		default: 'google',
		description: 'The platform to get',
		displayOptions: { show: { resource: ['platform'], operation: ['get'] } },
	},
];
