import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Countries } from '../../services/countries';
import { CommonModule } from '@angular/common';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-country',
  imports: [CommonModule, RouterLink],
  templateUrl: './country.html',
  styleUrls: ['./country.sass'],
})
export class Country implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private countriesService = inject(Countries);

  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef<HTMLDivElement>;
  private map?: maplibregl.Map;
  private marker?: maplibregl.Marker;

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

  ngAfterViewInit() {
    // Watch for country data changes and initialize/update map
    const checkAndInitializeMap = () => {
      const country = this.country();
      const container = this.mapContainer?.nativeElement;

      if (!country || !country.latlng || !container) {
        return;
      }

      const [lat, lng] = country.latlng;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return;
      }

      if (!this.map) {
        try {
          this.map = new maplibregl.Map({
            container,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [lng, lat],
            zoom: 3,
          });

          this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
          this.marker = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    checkAndInitializeMap();
    
    // Also check when country signal changes
    const interval = setInterval(checkAndInitializeMap, 500);
    
    // Clean up interval on destroy
    this.destroyFn = () => clearInterval(interval);
  }

  private destroyFn?: () => void;

  ngOnDestroy() {
    if (this.destroyFn) {
      this.destroyFn();
    }
    if (this.map) {
      this.map.remove();
    }
  }
}
