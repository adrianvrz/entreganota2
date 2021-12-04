import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mainForm: FormGroup;
  Data: any[] = []

  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if(res)
      {
        this.db.fecthPersonajes().subscribe(item => {
          this.Data = item
        })
      }
    });
    this.mainForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      estado: [''],
      especie: [''],
      genero: [''],
      ubicacion: [''],
      episodio: [''],
      temporada: [''],
      plataforma: ['']
  
    })
  }

  storeData() {
    this.db.addPersonaje(
      this.mainForm.value.nombre,
      this.mainForm.value.apellido,
      this.mainForm.value.estado,
      this.mainForm.value.especie,
      this.mainForm.value.genero,
      this.mainForm.value.ubicacion,
      this.mainForm.value.episodio
    ).then((res) => {
      this.mainForm.reset();
    })
  }

  deleteMusico(id) {
    this.db.deletePersonaje(id).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Personaje eliminado',
        duration: 3000
      });
      toast.present()
    })
  }
}
