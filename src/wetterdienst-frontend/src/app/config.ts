import { InjectionToken } from "@angular/core";

export interface AppConfig {
    dwdApi: {
        baseUrl: string;
    }
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const app_config: AppConfig = {
    "dwdApi": {
        "baseUrl": "https://opendata.dwd.de"
    }
}