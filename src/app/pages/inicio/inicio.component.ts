import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { StoreService } from '../../services/store/store.service';
import { IRespUser, IUser } from '../../core/interfaces/user.interface';
import { Subscription, map } from 'rxjs';
import { UserResModel } from '../../core/models/user.models';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit, AfterViewInit {
  storeServices = inject(StoreService);
  private _liveAnnouncer = inject(LiveAnnouncer);

  users: UserResModel[] = [];

  displayedColumns: string[] = [
    '_id',
    'name',
    'documentNumber',
    'createdAt',
    'role',
    'action',
  ];
  dataSource: any = '';

  constructor(private userService: UserService) {}

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((data: IRespUser) => {
      this.users = data.users;
      this.dataSource = new MatTableDataSource(this.users);
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  infoModal(element: UserResModel) {
    const createdAtFormatted = new Date(element.createdAt).toLocaleString('es-ES', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
    });
    Swal.fire({
      title: 'Información del Usuario',
      html: `
        <span class="badge bg-primary">ID:</span> <p class="fw-normal">${element._id}</p>
        <span class="badge bg-primary">Name:</span> <p class="fw-normal">${element.name}</p>
        <span class="badge bg-primary">Document Number:</span> <p class="fw-normal">${element.documentNumber}</p>
        <span class="badge bg-primary">Created At:</span> <p class="fw-normal">${createdAtFormatted}</p>
        <span class="badge bg-primary">Role:</span> <p class="fw-normal">${element.role}</p>
      `,
      icon: 'success',
      confirmButtonColor: '#22bb33',
      confirmButtonText: 'OK',
    });
  }
  editModal(element: UserResModel) {
    const createdAtFormatted = new Date(element.createdAt).toLocaleString('es-ES', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long',
      day: 'numeric', 
    });
    Swal.fire({
      title: 'Editar Información del Usuario',
      html: `
        <form id="editUserForm" >
          <div class="form-group mb-3">
            <label for="userId" class="badge bg-primary">ID:</label>
            <input type="text" id="userId" class="form-control form-control-sm" value="${element._id}" readonly />
          </div>
          <div class="form-group mb-3">
            <label for="userName" class="badge bg-primary">Name:</label>
            <input type="text" id="userName" class="form-control form-control-sm" value="${element.name}" />
          </div>
          <div class="form-group mb-3">
            <label for="documentNumber" class="badge bg-primary">Document Number:</label>
            <input type="text" id="documentNumber" class="form-control form-control-sm" value="${element.documentNumber}" />
          </div>
          <div class="form-group mb-3">
            <label for="createdAt" class="badge bg-primary">Created At:</label>
            <input type="text" id="createdAt" class="form-control form-control-sm" value="${createdAtFormatted}" readonly />
          </div>
          <div class="form-group mb-3">
            <label for="role" class="badge bg-primary">Role:</label>
            <input type="text" id="role" class="form-control form-control-sm" value="${element.role}" />
          </div>
        </form>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#22bb33',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar Cambios',
      preConfirm: () => {
        const userId = (document.getElementById('userId') as HTMLInputElement).value;
        const userName = (document.getElementById('userName') as HTMLInputElement).value;
        const documentNumber = (document.getElementById('documentNumber') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLInputElement).value;

        return {
          _id: userId,
          name: userName,
          documentNumber: documentNumber,
          role: role
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        console.log("Datos actualizados:", result.value);
      }
    });
  }


  
  
}
