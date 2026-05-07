import { Component, inject, signal, OnInit } from '@angular/core';
import { Countries as CountriesService } from '../../services/countries';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-countries',
  imports: [CommonModule, RouterLink],
  templateUrl: './countries.html',
  styleUrls: ['./countries.sass'],
})

export class Countries implements OnInit {

  private countriesService = inject(CountriesService);
  countries = signal<any[]>([]);

  // ✅ PAGINACIÓN
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = signal('');

  // ✅ Getter paginado + FILTRADO
  get filteredCountries() {
  const term = this.searchTerm().toLowerCase();

  return this.countries().filter(country =>
    country.name.common.toLowerCase().includes(term)
  );
 }


  // ✅ Getter paginado
  get paginatedCountries() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCountries.slice(start, end);
  }

  // ✅ TOTAL DE PÁGINAS (AQUÍ ESTÁ LO QUE TE FALTA)
  get totalPages() {
    return Math.ceil(this.filteredCountries.length / this.itemsPerPage);
  }

  // ✅ CAMBIO DE PÁGINA
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onSearch(term: string) {
  this.searchTerm.set(term);
  this.currentPage = 1; // 🔥 clave
}


  get visiblePages() {
  const total = this.totalPages;
  const current = this.currentPage;
  const maxVisible = 5;

  let start = Math.max(current - Math.floor(maxVisible / 2), 1);
  let end = start + maxVisible - 1;

  if (end > total) {
    end = total;
    start = Math.max(end - maxVisible + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

  ngOnInit(){
    this.countriesService.getCountries().subscribe({
      next: (data) => {
        this.countries.set(data);
        console.log(this.countries());
      },
      error: (error) => {console.error('Error fetching countries:', error);
      }
    });
  }
}
