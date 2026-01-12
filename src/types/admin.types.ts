export interface IAdminUserInfo {
    userId: number, 
    email: string;
    phone?: string;
    isActive: boolean;
    createdBy: number | null,
    createdByEmail?: string;
    activationDate?: string;
    numberOfDevices: number;
    totalStorageSize: number;
    maxUploadSize: number;
}

export type IAdminUserFormatted = IAdminUserInfo & {
  children: IAdminUserInfo[];
};

export type isActiveFilterType = "all" | "active" | "inactive";
