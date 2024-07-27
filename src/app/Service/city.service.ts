import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { City } from '../Models/City';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  getCities() {
    return this.http.get<any>(`https://localhost:7091/City`);
  }

  addCity(city:string) {
    return this.http.post<any>(`https://localhost:7091/City?name=${city}`,{});
  }

  updateCity(city:any) {
    console.log("city",city);
    return this.http.put<any>(`https://localhost:7091/City`,city);
  }
 

  deleteCity(id:number){
    return this.http.delete<any>(`https://localhost:7091/City?id=${id}`);
  }
}
