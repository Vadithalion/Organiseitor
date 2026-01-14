import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;
    private currentTheme: 'light' | 'dark' = 'light';

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.initTheme();
    }

    private initTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
            this.setTheme(savedTheme as 'light' | 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this.setTheme(prefersDark.matches ? 'dark' : 'light');
        }
    }

    setTheme(theme: 'light' | 'dark') {
        this.currentTheme = theme;
        localStorage.setItem('theme-preference', theme);

        if (theme === 'dark') {
            this.renderer.addClass(document.body, 'dark');
        } else {
            this.renderer.removeClass(document.body, 'dark');
        }
    }

    getTheme() {
        return this.currentTheme;
    }
}
