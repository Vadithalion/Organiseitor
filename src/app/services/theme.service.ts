import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark' | 'galactic';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;
    private themeSubject = new BehaviorSubject<AppTheme>('light');
    public theme$ = this.themeSubject.asObservable();

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.initTheme();
    }

    private initTheme() {
        const savedTheme = localStorage.getItem('theme-preference') as AppTheme;
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this.setTheme(prefersDark.matches ? 'dark' : 'light');
        }
    }

    setTheme(theme: AppTheme) {
        this.themeSubject.next(theme);
        localStorage.setItem('theme-preference', theme);

        // Remove all theme classes first
        this.renderer.removeClass(document.body, 'light');
        this.renderer.removeClass(document.body, 'dark');
        this.renderer.removeClass(document.body, 'galactic');

        // Add the new one
        this.renderer.addClass(document.body, theme);
    }

    getTheme(): AppTheme {
        return this.themeSubject.value;
    }
}
