import { Component } from '@angular/core';
import { MainNavService } from '../../services/main-nav.service';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css'],
})
export class AddNewRoleComponent {
  menuData: { id: number, name: string }[] = [];
  roleData: any = {
    name: '',
    role: [],
  };
  categoriesChecked: boolean = false;
  permissions: any = {
    add: false,
    edit: false,
    delete: false,
  };
  constructor(private menuService: MainNavService) { }

  ngOnInit(): void {
    this.menuData.push({ id: 1, name: 'Categories' });
    this.menuData.push({ id: 2, name: 'Episode' });
    this.menuData.push({ id: 3, name: 'Artical' });
  }

  onSubmit() {

  }
}
