import { v4 as uuid } from 'uuid';

import { getWidget, WidgetPreviewRenderRequest } from '../api/widget';
import WidgetFileType, { FileLoaderResponse } from '../../types';
import widgetTemplateLoader from '../widgetTemplate/widgetTemplateLoader/widgetTemplateLoader';
import widgetConfigLoader from '../widgetConfig/widgetConfigLoader/widgetConfigLoader';
import queryLoader from '../query/queryLoader/queryLoader';
import queryParamsLoader from '../query/queryParamsLoader/queryParamsLoader';
import { CHANNEL_ID } from '../auth/authConfig';
import translationsLoader from '../translation/translationLoader/translationLoader';

const getInitialRenderingPayload = (): WidgetPreviewRenderRequest => ({
    widget_configuration: {},
    widget_template: '',
    placement_uuid: uuid(),
    widget_uuid: uuid(),
    storefront_api_query: '',
    storefront_api_query_params: {},
    channel_id: CHANNEL_ID,
    schema_translations: '',
});

export function generateRenderPayloadFromFileLoaderResults(results: FileLoaderResponse[]): WidgetPreviewRenderRequest {
    return results.reduce(
        (acc: WidgetPreviewRenderRequest, current: FileLoaderResponse): WidgetPreviewRenderRequest => {
            const { data, type } = current;

            if (type === WidgetFileType.TEMPLATE) {
                return { ...acc, widget_template: data };
            }

            if (type === WidgetFileType.CONFIGURATION) {
                return { ...acc, widget_configuration: JSON.parse(data) };
            }

            if (type === WidgetFileType.QUERY) {
                return { ...acc, storefront_api_query: data };
            }

            if (type === WidgetFileType.QUERY_PARAMS) {
                return { ...acc, storefront_api_query_params: JSON.parse(data) };
            }

            if (type === WidgetFileType.TRANSLATION) {
                return { ...acc, schema_translations: JSON.parse(data) };
            }

            return acc;
        }, getInitialRenderingPayload(),
    );
}

export default function renderWidget(widgetDir: string): Promise<string> {
    return Promise.all([
        widgetTemplateLoader(widgetDir),
        widgetConfigLoader(widgetDir),
        queryLoader(widgetDir),
        queryParamsLoader(widgetDir),
        translationsLoader(widgetDir),
    ]).then(
        (results: FileLoaderResponse[]) => getWidget(
            generateRenderPayloadFromFileLoaderResults(results),
        ),
    );
}
