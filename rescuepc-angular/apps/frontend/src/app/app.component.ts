import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PricingSectionComponent } from './components/pricing-section/pricing-section.component';
import { FAQAccordionComponent } from './components/faq-accordion/faq-accordion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeroComponent,
    NavbarComponent,
    FooterComponent,
    PricingSectionComponent,
    FAQAccordionComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-pricing-section></app-pricing-section>
      <app-faq-accordion></app-faq-accordion>
      <!-- Other components will be added here -->
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      main {
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {
  title = 'RescuePC Repairs - Angular';
}
