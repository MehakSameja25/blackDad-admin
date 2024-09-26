import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminAuthComponent } from './admin/admin-auth/admin-auth.component';
import { AdminEpisodesComponent } from './admin/admin-episodes/admin-episodes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminNavbarComponent } from './admin/admin-navbar/admin-navbar.component';
import { AdminArticlesComponent } from './admin/admin-articles/admin-articles.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminMetasComponent } from './admin/admin-metas/admin-metas.component';
import { AllMembersComponent } from './admin/admin-members/all-members/all-members.component';
import { AddNewMemberComponent } from './admin/admin-members/add-new-member/add-new-member.component';
import { RolesComponent } from './admin/admin-members/roles/roles.component';
import { AddNewRoleComponent } from './admin/admin-members/add-new-role/add-new-role.component';
import { AssignRoleComponent } from './admin/admin-members/assign-role/assign-role.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddEpisodesComponent } from './admin/admin-posts/add-episodes/add-episodes.component';
import { AddArticlesComponent } from './admin/admin-posts/add-articles/add-articles.component';
import { AddAdvertisementsComponent } from './admin/admin-posts/add-advertisements/add-advertisements.component';
import { EditEpisodesComponent } from './admin/admin-posts/edit-episodes/edit-episodes.component';
import { EditArticlesComponent } from './admin/admin-posts/edit-articles/edit-articles.component';
import { EditAdvertisementsComponent } from './admin/admin-posts/edit-advertisements/edit-advertisements.component';
import { AuthInterceptor } from './admin/main-interceptors/auth.interceptor';
import { AuthGuard } from './admin/guards/auth.guard';
import { DetailEpisodeComponent } from './admin/admin-posts/detail-episode/detail-episode.component';
import { DetailArticleComponent } from './admin/admin-posts/detail-article/detail-article.component';
import { DetailAdvertisementsComponent } from './admin/admin-posts/detail-advertisements/detail-advertisements.component';
import { AdminEditMetasComponent } from './admin/admin-edit-metas/admin-edit-metas.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EditMemberComponent } from './admin/admin-members/edit-member/edit-member.component';
import { GoBackComponent } from './admin/go-back/go-back.component';
import { ChangePasswordComponent } from './admin/admin-members/change-password/change-password.component';
import { EditDraftComponent } from './admin/draft/edit-draft/edit-draft.component';
import { EditArticleDraftComponent } from './admin/draft/edit-article-draft/edit-article-draft.component';
import { AdminEpisodeDraftComponent } from './admin/draft/admin-episode-draft/admin-episode-draft.component';
import { AdminArticleDraftComponent } from './admin/draft/admin-article-draft/admin-article-draft.component';
import { DataTableDirective } from './Directives/dataTable.directive';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EpisodeScheduleComponent } from './admin/admin-scheduling/episode-schedule/episode-schedule.component';
import { ArticleScheduleComponent } from './admin/admin-scheduling/article-schedule/article-schedule.component';
import { EpisodeTabsComponent } from './admin/admin-tabs/episode-tabs/episode-tabs.component';
import { ArticleTabsComponent } from './admin/admin-tabs/article-tabs/article-tabs.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdminAdvertisementsComponent } from './admin/admin-advertisements/admin-advertisements.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoaderInterceptor } from './admin/main-interceptors/loader.interceptor';
import { LoaderComponent } from './admin/loader/loader.component';
import { ArticalTypesComponent } from './admin/artical-types/artical-types.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminAuthComponent,
    AdminEpisodesComponent,
    AdminNavbarComponent,
    AdminArticlesComponent,
    AdminCategoriesComponent,
    AdminMetasComponent,
    AllMembersComponent,
    AddNewMemberComponent,
    RolesComponent,
    AddNewRoleComponent,
    AssignRoleComponent,
    AdminProfileComponent,
    AddEpisodesComponent,
    AddArticlesComponent,
    AddAdvertisementsComponent,
    EditEpisodesComponent,
    EditArticlesComponent,
    EditAdvertisementsComponent,
    DetailEpisodeComponent,
    DetailArticleComponent,
    DetailAdvertisementsComponent,
    AdminEditMetasComponent,
    AdminEpisodeDraftComponent,
    AdminArticleDraftComponent,
    EditMemberComponent,
    GoBackComponent,
    ChangePasswordComponent,
    EditDraftComponent,
    EditArticleDraftComponent,
    DataTableDirective,
    EpisodeScheduleComponent,
    ArticleScheduleComponent,
    EpisodeTabsComponent,
    ArticleTabsComponent,
    AdminAdvertisementsComponent,
    LoaderComponent,
    ArticalTypesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    CKEditorModule,
    ImageCropperComponent,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot({
      timeOut: 3500,
      showProgressBar: true,
      clickToClose: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
