export const Themes = {
    light: 'light',
    dark: 'dark'
};

export interface DashboardConfig {
    path: string;
    id?: number;
    theme: 'dark' | 'light' | string;
    type: 'bar' | 'doughnut' | string;
}
