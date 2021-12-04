import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-personaje',
  templateUrl: './personaje.page.html',
  styleUrls: ['./personaje.page.scss'],
})
export class PersonajePage implements OnInit {

  editForm : FormGroup;
  id: any;

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    private actrouter: ActivatedRoute
  ) {
    this.id = this.actrouter.snapshot.paramMap.get('id');

    this.db.getPersonaje(this.id).then(res => {
      this.editForm.setValue({
      nombre: res['nombre'],
      apellido: res['apellido'],
      estado: res['estado'],
      especie: res['especie'],
      genero: res['genero'],
      ubicacion: res['ubicacion'],
      episodio: res['episodio']

      })
    })
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      estado: [''],
      especie: [''],
      genero: [''],
      ubicacion: [''],
      episodio: ['']
     
    });
  }

  updatePersonaje() {
    this.db.updatePersonaje(this.id, this.editForm.value).then((res) =>{
      console.log(res)
      this.router.navigate(['/home']);
    })
  }


}
