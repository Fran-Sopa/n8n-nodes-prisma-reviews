import type { INodeProperties } from 'n8n-workflow';
import { unwrapData } from '../shared/descriptions';

const showForLocation = { resource: ['location'] };

export const locationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForLocation },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a location',
				description: 'Get a single location by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/locations/{{encodeURIComponent($parameter.locationId)}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many locations',
				description: 'List many locations of the workspace',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/locations',
					},
					output: {
						postReceive: [unwrapData],
					},
				},
			},
			{
				name: 'Refresh',
				value: 'refresh',
				action: 'Refresh a location',
				description: 'Queue a sync of the location to fetch new reviews now',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/locations/{{encodeURIComponent($parameter.locationId)}}/refresh',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'loc_01KJ8P9W2C4D6F8G0H2J4K6M8N',
		description: 'The location ID (loc_…)',
		displayOptions: { show: { resource: ['location'], operation: ['get', 'refresh'] } },
	},
];
