import { InjectionToken } from "@angular/core";

export interface AppConfig {
    API: {
        baseUrl: string;
    }
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const app_config: AppConfig = {
    "API": {
        "baseUrl": "http://localhost:8080/api"
    }
}