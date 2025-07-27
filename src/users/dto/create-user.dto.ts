
export class CreateUserDto {
  full_name: string;
  phone: string;
  email: string;
  isActivated?: boolean;
  activationLink?: string;
  is_approved?: boolean; 
  role: string;
  refreshToken?: string;
}
