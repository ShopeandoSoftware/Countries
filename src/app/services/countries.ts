import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  

@Injectable({
  providedIn: 'root',
})
export class Countries {
  private http = inject (HttpClient);


  getCountries() {
    return this.http.get<any[]>('https://api4devs.infinitec.com/v3.1/all?fields=name,area,population,flags,cca2');
  }

  getCountry(code: string) {
    return this.http.get<any>(`https://api4devs.infinitec.com/v3.1/alpha/${code}?fields=name,area,population,flags,maps,capital,latlng`);
  }
}
