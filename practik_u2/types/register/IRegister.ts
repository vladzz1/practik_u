import { IImageFile } from "../common/IImageFile"

export interface IRegister {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    imegeFile?: IImageFile
}