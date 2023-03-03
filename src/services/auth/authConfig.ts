import dotenv from 'dotenv';

dotenv.config();

export interface AuthConfig {
    authId: string;
    apiPath: string;
    authToken: string;
}

export const AUTH_CONFIG: AuthConfig = {
    authId: process.env.WIDGET_BUILDER_AUTH_ID || '',
    apiPath: process.env.WIDGET_BUILDER_API_GATEWAY_BASE || '',
    authToken: process.env.WIDGET_BUILDER_AUTH_TOKEN || '',
};

export const CHANNEL_ID = process.env.WIDGET_BUILDER_CHANNEL_ID ? parseInt(process.env.WIDGET_BUILDER_CHANNEL_ID, 10) : 1;
