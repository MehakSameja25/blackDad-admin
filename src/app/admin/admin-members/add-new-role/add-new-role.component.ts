import { Component } from '@angular/core';
import { MainNavService } from '../../services/main-nav.service';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css'],
})
export class AddNewRoleComponent {
  menuData: any;
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
  constructor(private menuService: MainNavService) {}

  ngOnInit(): void {
    this.getMenuBar();
  }

  getMenuBar() {
    this.menuService.getMenu().subscribe((response: any) => {
      this.menuData = response.data[0].role_accesses;
      console.log('Menu bar', this.menuData);
    });
  }
  onSubmit(){
    
  }
}
