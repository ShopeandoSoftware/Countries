import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Countries } from '../../services/countries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country',
  imports: [CommonModule, RouterLink],
  templateUrl: './country.html',
  styleUrl: './country.sass',
})
export class Country implements OnInit {
  private route = inject(ActivatedRoute);
  private countriesService = inject(Countries);

  country = signal<any>(null);

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.countriesService.getCountry(code).subscribe({
        next: (data) => this.country.set(data),
        error: (err) => console.error('Error fetching country:', err)
      });
    }
  }
}
