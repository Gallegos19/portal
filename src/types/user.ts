import { UserRole, User } from './auth';

export interface SchoolInfo {
  institution: string;
  career: string;
  semester: number;
  studentId: string;
}

export interface PersonalInfo {
  phone: string;
  address: string;
  birthDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface BecarioUser extends User {
  role: UserRole.BECARIO;
  facilitadorId: string;
  schoolInfo: SchoolInfo;
  personalInfo: PersonalInfo;
}

export interface FacilitadorUser extends User {
  role: UserRole.FACILITADOR;
  subprojectId: string;
  regionId: string;
  becarios: string[];
}

export interface AdminUser extends User {
  role: UserRole.ADMIN;
  permissions: string[];
}