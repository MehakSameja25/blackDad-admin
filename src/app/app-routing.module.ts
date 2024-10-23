import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthComponent } from './admin/admin-auth/admin-auth.component';
import { AdminEpisodesComponent } from './admin/admin-episodes/admin-episodes.component';
import { AdminArticlesComponent } from './admin/admin-articles/admin-articles.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminMetasComponent } from './admin/admin-metas/admin-metas.component';
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
import { EditMemberComponent } from './admin/admin-members/edit-member/edit-member.component';
import { ChangePasswordComponent } from './admin/admin-members/change-password/change-password.component';
import { EditArticleDraftComponent } from './admin/draft/edit-article-draft/edit-article-draft.component';
import { EditDraftComponent } from './admin/draft/edit-draft/edit-draft.component';
import { AdminArticleDraftComponent } from './admin/draft/admin-article-draft/admin-article-draft.component';
import { AdminEpisodeDraftComponent } from './admin/draft/admin-episode-draft/admin-episode-draft.component';
import { EpisodeScheduleComponent } from './admin/admin-scheduling/episode-schedule/episode-schedule.component';
import { ArticleScheduleComponent } from './admin/admin-scheduling/article-schedule/article-schedule.component';
import { AdminAdvertisementsComponent } from './admin/admin-advertisements/admin-advertisements.component';
import { ListManufacturerComponent } from './admin/ecommerce/manufacturer/main/list-manufacturer/list-manufacturer.component';
import { EditManufacturerComponent } from './admin/ecommerce/manufacturer/main/edit-manufacturer/edit-manufacturer.component';
import { ListProductComponent } from './admin/ecommerce/product/list-product/list-product.component';
import { EditProductComponent } from './admin/ecommerce/product/edit-product/edit-product.component';
import { ProductCategoriesComponent } from './admin/ecommerce/product-categories/product-categories.component';
import { DetalisProductComponent } from './admin/ecommerce/product/detalis-product/detalis-product.component';
import { ManufacturerOrdersComponent } from './admin/ecommerce/manufacturer/orders/manufacturer-orders/manufacturer-orders.component';
import { ManufacturerDashboardComponent } from './admin/ecommerce/manufacturer/main/manufacturer-dashboard/manufacturer-dashboard.component';
import { ManufacturerOrderVieComponent } from './admin/ecommerce/manufacturer/orders/manufacturer-order-vie/manufacturer-order-vie.component';
import { ProductPreviewComponent } from './admin/ecommerce/product/product-preview/product-preview.component';
import { AddComponent } from './admin/ecommerce/manufacturer/roles/add/add.component';
import { ListComponent } from './admin/ecommerce/manufacturer/roles/list/list.component';
import { AssignComponent } from './admin/ecommerce/manufacturer/roles/assign/assign.component';
import { ArticalTypesComponent } from './admin/artical-types/artical-types.component';
import { WarehouseLocationComponent } from './admin/ecommerce/warehouse-location/warehouse-location.component';
import { HelpFaqComponent } from './admin/ecommerce/faq/help-faq/help-faq.component';

const routes: Routes = [
  { path: 'admin-auth', component: AdminAuthComponent },
  { path: '', redirectTo: 'admin-auth', pathMatch: 'full' },
  { path: 'forget-password', component: AdminAuthComponent },
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
    path: 'admin/artical-types',
    component: ArticalTypesComponent,
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
    path: 'admin/edit-role/:id',
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
  {
    path: 'admin/edit-member/:id',
    component: EditMemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'admin/draft-episode',
    component: AdminEpisodeDraftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/draft-article',
    component: AdminArticleDraftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-draft-article/:id',
    component: EditArticleDraftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-draft-episode/:id',
    component: EditDraftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/scheduled-episodes',
    component: EpisodeScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/scheduled-articles',
    component: ArticleScheduleComponent,
    canActivate: [AuthGuard],
  },

  /**----Ecommerce Routes---- **/

  // for admin
  {
    path: 'manufacturers',
    component: ListManufacturerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-manufacturer',
    component: EditManufacturerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-manufacturer/:id',
    component: EditManufacturerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ListProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/preview',
    component: ProductPreviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-draft/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'details-product/:id',
    component: DetalisProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/categories',
    component: ProductCategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/dashboard',
    component: ManufacturerDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/manufecturer/roles',
    component: ListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/manufecturer/roles/add',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/manufecturer/roles/update/:id',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/manufecturer/role/assigning',
    component: AssignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/all-orders',
    component: ManufacturerOrdersComponent,
    canActivate: [AuthGuard],
  },

  // for manufacturers
  {
    path: 'manufacturer/my-orders',
    component: ManufacturerOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manufacturer/order/view/:id',
    component: ManufacturerOrderVieComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manufacturer/dashboard',
    component: ManufacturerDashboardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'admin/location',
    component: WarehouseLocationComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'admin/faq',
    component: HelpFaqComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'product/drafts',
    component: ListProductComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    component: AdminAuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
