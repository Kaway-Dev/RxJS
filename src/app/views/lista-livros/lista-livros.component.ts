import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
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
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.CampoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('fluxo inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar
        (valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      catchError(erro => {
        console.log(erro)
        return of()
      })
    )

  livrosEncontrados$ = this.CampoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('fluxo inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar
        (valorDigitado)),

      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadosParaLivros
        (items)),
      catchError((erro) => {
        //   this.mensagemErro = 'ops, deu erro. Recarregue a página'
        //   return EMPTY;
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro = "ops, ocorreu um erro. Recarregue a página"))
      })
    )


  livrosResultadosParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(element => new LivroVolumeInfo(element));
  }
}
