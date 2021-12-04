import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Personaje } from './personaje';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private storage: SQLiteObject;
  personajeList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlporter: SQLitePorter) {
      this.platform.ready().then(() => {
        this.sqlite.create({
          name: 'personaje.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
        });
      });

     }

    dbState(){
      return this.isDbReady.asObservable();
    }

    fecthPersonajes():Observable<Personaje[]> {
      return this.personajeList.asObservable();
    }

    getFakeData(){
      this.httpClient.get(
        'assets/script.sql',{responseType: 'text'}
      ).subscribe(data =>{
        this.sqlporter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getPersonajes();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
        
      })
    }

    //CRUD

    //OBTENER LA LISTA
    getPersonajes(){
      return this.storage.executeSql('SELECT * FROM personaje',[]).then(res =>{
        let items: Personaje[] = [];
        if(res.rows.length > 0)
        {
          for(var i=0; i < res.rows.length; i++)
          {
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
              apellido: res.rows.item(i).apellido,
              estado: res.rows.item(i).estado,
              especie: res.rows.item(i).especie,
              genero: res.rows.item(i).genero,
              ubicacion: res.rows.item(i).ubicacion,
              episodio: res.rows.item(i).episodio,
          
            });
          }
        }
        this.personajeList.next(items);
      });
    }

    //AGREGAR OBJETOS A LA BD
    addPersonaje(nombre, apellido, estado, especie, genero, ubicacion, espisodio){
      let data =[nombre, apellido, estado, especie, genero, ubicacion, espisodio];
      return this.storage.executeSql('INSERT INTO personaje (nombre, apellido, estado, especie, genero, ubicacion, espisodio) VALUES (?,?)',data)
      .then(res => {
        this.getPersonajes();
      });
    }

    getPersonaje(id): Promise<Personaje>{
      return this.storage.executeSql('SELEXT * FROM personaje WHERE ID=?',[id])
      .then(res =>{
        return {
          id: res.rows.item(0).id,
          nombre: res.rows.item(0).nombre,
          apellido: res.rows.item(0).apellido,
          estado: res.rows.item(0).estado,
          especie: res.rows.item(0).especie,
          genero: res.rows.item(0).genero,
          ubicacion: res.rows.item(0).ubicacion,
          episodio: res.rows.item(0).episodio
        }
      });
    }

    updatePersonaje(id, personaje:Personaje){
      let data = [personaje.nombre,personaje.apellido,personaje.estado,personaje.especie,personaje.genero,personaje.ubicacion,personaje.episodio];
      return this.storage.executeSql(`UPDATE personaje SET nombre = ?, apellido = ?, estado = ?, especie = ?, genero = ?, ubicacion = ?, espisodio = ? WHERE id = ${id}`)
      .then(_ =>{
        this.getPersonajes();
      });
    }

    deletePersonaje(id){
      return this.storage.executeSql('DELETE FROM personaje WHERE id=?',[id])
      .then(_ =>{
        this.getPersonajes();
      });
    }

}  
