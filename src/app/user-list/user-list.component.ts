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

  displayedColumns: string[] = ['name', 'email', 'city', 'company', 'actions'];

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
        ? this.filterBySpecificFields(user, filterValue)
        : this.filterByAnyField(user, filterValue)
    );
  }

  filterByAnyField(user: any, filterValue: string): boolean {
    if (
      user.hasOwnProperty('name') &&
      typeof user['name'] === 'string' &&
      user['name'].toLowerCase().includes(filterValue)
    ) {
      return true;
    }
    return false;
  }

  filterBySpecificFields(user: any, filterValue: string): boolean {
    const fieldsToFilter = ['name', 'email', 'address', 'company'];
    for (const key of fieldsToFilter) {
      if (
        user.hasOwnProperty(key) &&
        typeof user[key] === 'string' &&
        user[key].toLowerCase().includes(filterValue)
      ) {
        return true;
      } else if (
        key === 'address' &&
        user.hasOwnProperty('address') &&
        user.address.hasOwnProperty('city') &&
        typeof user.address.city === 'string' &&
        user.address.city.toLowerCase().includes(filterValue)
      ) {
        return true;
      } else if (
        key === 'company' &&
        user.hasOwnProperty('company') &&
        user.company.hasOwnProperty('name') &&
        typeof user.company.name === 'string' &&
        user.company.name.toLowerCase().includes(filterValue)
      ) {
        return true;
      }
    }
    return false;
  }



}
