import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchText: string = '';
  errorMessage: string = '';
  searchByAnyField: boolean = false;
  usePagination: boolean = false;

  displayedColumns: string[] = ['name', 'email', 'city', 'company', 'actions'];

  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Obtém os usuários do serviço UserService
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users; // Inicializa a lista filtrada com todos os usuários
      },
      error: (error) => {
        this.errorMessage = error;
      }
    }
    );
  }

  openUserModal(user: User): void {
    // Abre o modal do usuário
    this.dialog.open(UserModalComponent, {
      width: '400px',
      data: user
    });
  }

  applyFilter(): void {
    // Aplica o filtro de pesquisa nos usuários com base no texto de pesquisa
    const filterValue = this.searchText.trim().toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      this.searchByAnyField
        ? this.filterByAnyField(user, filterValue)
        : this.filterBySpecificFields(user, filterValue)
    );
  }

  filterBySpecificFields(user: any, filterValue: string): boolean {
    // Filtra pelo campo 'name' do usuário
    if (
      user.hasOwnProperty('name') &&
      typeof user['name'] === 'string' &&
      user['name'].toLowerCase().includes(filterValue)
    ) {
      return true;
    }
    return false;
  }

  filterByAnyField(user: any, filterValue: string): boolean {
    const fieldsToFilter = ['name', 'email', 'address', 'company'];   // Campos nos quais será realizado o filtro
    for (const key of fieldsToFilter) {
      if (
        user.hasOwnProperty(key) &&                                // Verifica se o usuário possui o campo atual
        typeof user[key] === 'string' &&                            // Verifica se o valor do campo é uma string
        user[key].toLowerCase().includes(filterValue)               // Verifica se o valor do campo contém o valor do filtro, ignorando maiúsculas e minúsculas
      ) {
        return true;
      } else if (
        key === 'address' &&
        user.hasOwnProperty('address') &&                           // Verifica se o usuário possui o campo 'address'
        user.address.hasOwnProperty('city') &&                      // Verifica se o campo 'address' possui o campo 'city'
        typeof user.address.city === 'string' &&                     // Verifica se o valor de 'city' é uma string
        user.address.city.toLowerCase().includes(filterValue)        // Verifica se o valor de 'city' contém o valor do filtro, ignorando maiúsculas e minúsculas
      ) {
        return true;
      } else if (
        key === 'company' &&
        user.hasOwnProperty('company') &&                           // Verifica se o usuário possui o campo 'company'
        user.company.hasOwnProperty('name') &&                      // Verifica se o campo 'company' possui o campo 'name'
        typeof user.company.name === 'string' &&                     // Verifica se o valor de 'name' é uma string
        user.company.name.toLowerCase().includes(filterValue)        // Verifica se o valor de 'name' contém o valor do filtro, ignorando maiúsculas e minúsculas
      ) {
        return true;
      }
    }
    return false;
  }


}
