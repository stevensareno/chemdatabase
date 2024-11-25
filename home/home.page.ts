import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  chemicalData: any[] = [];

  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    // Initialize the database and create the table
    await this.databaseService.initializeDatabase();
    await this.databaseService.createTable();

    // Load data from the JSON file and insert it into the SQLite database
    await this.databaseService.loadDataFromJSON();

    // Fetch the data from the SQLite database
    this.chemicalData = await this.databaseService.fetchAllData();
    console.log(this.chemicalData);
  }
}

