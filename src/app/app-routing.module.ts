import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthComponent } from './admin/admin-auth/admin-auth.component';
import { AdminEpisodesComponent } from './admin/admin-episodes/admin-episodes.component';
import { AdminArticlesComponent } from './admin/admin-articles/admin-articles.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminMetasComponent } from './admin/admin-metas/admin-metas.component';
import { AdminAdvertisementsComponent } from './admin/admin-advertisements/admin-advertisements.component';
import { AllMembersComponent } from './admin/admin-members/all-members/all-members.component';
import { AddNewMemberComponent } from './admin/admin-members/add-new-member/add-new-member.component';
import { RolesComponent } from './admin/admin-members/roles/roles.component';
import { AddNewRoleComponent } from './admin/admin-members/add-new-role/add-new-role.component';
import { AssignRoleComponent } from './admin/admin-members/assign-role/assign-role.component';
import { AddArticlesComponent } from './admin/admin-posts/add-articles/add-articles.component';
import { AddEpisodesComponent } from './admin/admin-posts/add-episodes/add-episodes.component';
import { AddAdvertisementsComponent } from './admin/admin-posts/add-advertisements/add-advertisements.component';
import { EditArticlesComponent } from './admin/admin-posts/edit-articles/edit-articles.component';
import { EditEpisodesComponent } from './admin/admin-posts/edit-episodes/edit-episodes.component';
import { EditAdvertisementsComponent } from './admin/admin-posts/edit-advertisements/edit-advertisements.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { AuthGuard } from './admin/guards/auth.guard';
import { DetailEpisodeComponent } from './admin/admin-posts/detail-episode/detail-episode.component';
import { DetailArticleComponent } from './admin/admin-posts/detail-article/detail-article.component';
import { DetailAdvertisementsComponent } from './admin/admin-posts/detail-advertisements/detail-advertisements.component';
import { AdminEditMetasComponent } from './admin/admin-edit-metas/admin-edit-metas.component';

const routes: Routes = [
  { path: 'admin-auth', component: AdminAuthComponent },
  { path: '', redirectTo: 'admin-auth', pathMatch: 'full' },
  {
    path: 'admin/episodes',
    component: AdminEpisodesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/articles',
    component: AdminArticlesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/advertisements',
    component: AdminAdvertisementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/metas',
    component: AdminMetasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/all-members',
    component: AllMembersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/add-member',
    component: AddNewMemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/role-type',
    component: RolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/add-role',
    component: AddNewRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/assign-role',
    component: AssignRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/add-article',
    component: AddArticlesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/add-episode',
    component: AddEpisodesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/add-advertisement',
    component: AddAdvertisementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-article/:id',
    component: EditArticlesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-episode/:id',
    component: EditEpisodesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-advertisement/:id',
    component: EditAdvertisementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/detail-episode/:id',
    component: DetailEpisodeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/detail-article/:id',
    component: DetailArticleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/detail-advertisement/:id',
    component: DetailAdvertisementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-metas/:type',
    component: AdminEditMetasComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
