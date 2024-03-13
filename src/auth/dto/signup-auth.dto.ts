import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignupAuthDto{
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:string;

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    username:string;
}
