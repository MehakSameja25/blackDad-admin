import { BaseModel } from './base.model';

export class User extends BaseModel {
  'id': number;
  'name': string;
  'email': string;
  'email_verified_at': null;
  'password': string;
  'text_password': null;
  'remember_token': null;
  'type': string;
  'user_verification': string;
  'isBlock': boolean;
  'is_deleted': string;
}
