export const Themes = {
    light: 'light',
    dark: 'dark'
};

export interface DashboardConfig {
    path: string;
    id?: string;
    theme: 'dark' | 'light' | string;
    type: 'bar' | 'doughnut' | 'icon' | string;
    icon?: string;
}
