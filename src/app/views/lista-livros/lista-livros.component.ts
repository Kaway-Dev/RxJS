import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent implements OnDestroy {
  listaLivros: Livro[];
  CampoBusca: string = '';
  subscription: Subscription;
  livro: Livro;

  constructor(private service: LivroService) {}

  buscarLivros() {
    this.subscription = this.service.buscar(this.CampoBusca).subscribe({
      next: (itens) => {
        this.listaLivros = this.livrosResultadosParaLivros(itens);
      },
      error: (erro) => console.error(erro),
    });
  }

  livrosResultadosParaLivros(items: Item[] ): LivroVolumeInfo[] {
    return items.map(element => new LivroVolumeInfo(element));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
