import {User} from "../entity/User";

export interface UserTechnologiesDto extends User{
    technologies: string[];
}