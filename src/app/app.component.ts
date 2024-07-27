import { RouterOutlet } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CityService } from './Service/city.service';
import { City } from './Models/City';
import { NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Location, NgIf } from '@angular/common';

import Swal from 'sweetalert2';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, ButtonModule, NgFor, RouterOutlet, TableModule, HttpClientModule, InputTextModule, TagModule, IconFieldModule, InputIconModule],
  providers: [CityService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  cities: City[] = [];
  filteredCities: City[] = []

  constructor(private cityService: CityService) { }

  ngOnInit() {
    this.cityService.getCities().subscribe(data => {
      this.cities = data;
      this.filteredCities = this.cities
    });
  }

  private convertToHebrew(input: string): string {
    const keyMap: { [key: string]: string } = {
      'a': 'ש', 'b': 'נ', 'c': 'ב', 'd': 'ג', 'e': 'ק', 'f': 'כ', 'g': 'ע',
      'h': 'י', 'i': 'ן', 'j': 'ח', 'k': 'ל', 'l': 'ך', 'm': 'צ', 'n': 'מ',
      'o': 'ם', 'p': 'פ', 'q': '/', 'r': 'ר', 's': 'ד', 't': 'א', 'u': 'ו',
      'v': 'ה', 'w': "'", 'x': 'ס', 'y': 'ט', 'z': 'ז'
    };
    return input.split('').map(char => keyMap[char] || char).join('');
  }


  filterGlobal(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.name!.toLowerCase().includes(input))
    if (this.filteredCities = []) {
      const hebrewInput = this.convertToHebrew(input);
      this.filteredCities = this.cities.filter(client =>
        client.name!.includes(hebrewInput)
      );
    }
  }


  onEdit(city: City) {
    console.log(city);
    Swal.fire({
      title: 'עריכת יישוב',
      input: 'text',
      inputValue: city.name,
      showDenyButton: true,
      confirmButtonText: 'עדכון',
      denyButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        const cityName = result.value;
        var item={id:city.id,name:cityName}
        this.cityService.updateCity(item).subscribe(data => {
          Swal.fire('היישוב עודכן בהצלחה', cityName, "success");
          this.cityService.getCities().subscribe(data => {
            this.cities = data;
            this.filteredCities = this.cities
          });
        });
      }
    });

  }

  onDelete(city: City) {
    Swal.fire({
      title: '?האם אתה בטוח שברצונך למחוק',
      text: "!לא תוכל לשחזר זאת",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן, אני מעוניין להמשיך',
      showDenyButton: true,
      denyButtonText: 'ביטול',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cityService.deleteCity(city.id!).subscribe((res) => {
          Swal.fire('היישוב נמחק בהצלחה', "", "success");
          this.cityService.getCities().subscribe(data => {
            this.cities = data;
            this.filteredCities = this.cities
          });
        })
      }
    });
  }

  openAddComponent() {
    Swal.fire({
      title: 'הוספת יישוב',
      input: 'text',
      inputPlaceholder: 'הכנס שם יישוב',
      confirmButtonText: 'הוספה',
      showDenyButton: true,
      denyButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        const cityName = result.value;
        this.cityService.addCity(cityName).subscribe(data => {
          Swal.fire('היישוב נוסף בהצלחה', cityName, "success");
          this.cityService.getCities().subscribe(data => {
            this.cities = data;
            this.filteredCities = this.cities
          });
        });
      }
    });

  }
}
