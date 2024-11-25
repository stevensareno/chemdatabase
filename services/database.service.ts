import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { HttpClient } from '@angular/common/http';  // Import HttpClient to read the JSON file

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db!: SQLiteDBConnection;

  constructor(private http: HttpClient) {}

  // Initialize SQLite Database connection
 
  async initializeDatabase() {
    try {
      const connection = await CapacitorSQLite.createConnection({
        database: 'chemicalDB',  // Database name
        version: 1,              // Database version
        encrypted: false,        // Encryption
        mode: 'no-encryption',
      }) as SQLiteDBConnection | void;  // Type assertion here
  
      // Check if connection is valid (not void)
      if (connection) {
        this.db = connection;
      } else {
        console.error('Connection failed: No valid database connection returned.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }  
  
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS chemical_data (
        id TEXT PRIMARY KEY,
        type TEXT,
        label TEXT
      )
    `;
    try {
      await this.db.execute(query);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

 // Insert data into the table
async insertData(id: string, type: string, label: string) {
  const query = 'INSERT INTO chemical_data (id, type, label) VALUES (?, ?, ?)';
  try {
    // Use `run` instead of `execute` for inserting data
    await this.db.run(query, [id, type, label]);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


 
async loadDataFromJSON() {
  const jsonFilePath = 'assets/json database';  
  try {
    const data = await this.http.get<any[]>(jsonFilePath).toPromise() || [];  

    for (const item of data) {
      const id = item["@id"];
      const type = item["@type"][0];  
      const label = item["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
      await this.insertData(id, type, label);  
    }
  } catch (error) {
    console.error('Error loading data from JSON file:', error);
  }
}


  // Fetch all data from the table
  async fetchAllData() {
    const query = 'SELECT * FROM chemical_data';
    try {
      const result = await this.db.query(query);
      return result.values || [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
}
