import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const pausa = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  CampoBusca = new FormControl();

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.CampoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('fluxo inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar
        (valorDigitado)),

      tap((retornoAPI) => console.log(retornoAPI)),
      map((items) => this.livrosResultadosParaLivros
        (items))
    )


  livrosResultadosParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(element => new LivroVolumeInfo(element));
  }
}
