
export type UsersQueryResponse = {
	data: User[];
	status: string;
	pagingData: PagingData;
};

export type UserQueryResponse = {
	data: User;
	status: string;
};

export type AllProjectQueryResponse = {
	data: AllProject[];
	status: string;
};

export type User = {
	id?: number;
	active: boolean;
	name?: string;
	surname?: string;
	email?: string;
	phone?: string;
	password?: string;
	role?: string;
	type?: string;
	salary: number;
	projectPermission?: number[];
	entranceFormPermission?: boolean;
	exitFormPermission?: boolean;
	supplyFormPermission?: boolean;
	patientFormPermission?: boolean;
	lastLoginAt?: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string;
};

export type AllProject = {
	id?: number;
	name: string;
};

export type PagingData = {
	totalItems: number;
	totalPages: number;
	currentPage: number;
};

export type UpdateQueryResponse = {
	status: string;
	message: string;
};

export type GetFilesQueryResponse = {
	status: string;
	data: FileData[];
	message: string;
};

export type FileData = {
	id: number;
	fileUrl: string;
	fileName: string;
	fileSize: string;
	attachedTo: number;
	permissionLevel: string;
	uploadedBy: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};

export type SetVacationPermitQueryResponse = {
	status: string;
	message: string;
};

export type UserStatisticsQueryResponse = {
	status: string;
	message: string;
	entries: Record<string, number>;
	exits: Record<string, number>;
	freeVacations: Record<string, number>;
	birthVacations: Record<string, number>;
	deathVacations: Record<string, number>;
	reportVacations: Record<string, number>;
	weeklyVacations: Record<string, number>;
};

export type UserStats = {
	month: string;
	entries: number;
	exits: number;
	freeVacations: number;
	birthVacations: number;
	deathVacations: number;
	reportVacations: number;
	weeklyVacations: number;
};

export type UserVacationsQueryResponse = {
	status: string;
	data: VacationData[];
	pagingData: PagingData;
};

export type VacationData = {
	id: number;
	userId: number;
	permittedBy: number;
	startDate: string;
	endDate: string;
	reason: string;
	cratedAt: string;
	updatedAt: string;
};

export type DeleteQueryResponse = {
	status: string;
	message: string;
};

export type UpdateVacationQueryResponse = {
	status: string;
	message: string;
};

export type UserShiftQueryResponse = {
	status: string;
	data: UserShiftData;
	message: string;
};

export type UserShiftData = {
	monday: UserShiftDay;
	tuesday: UserShiftDay;
	wednesday: UserShiftDay;
	thursday: UserShiftDay;
	friday: UserShiftDay;
	saturday: UserShiftDay;
	sunday: UserShiftDay;
};

export type UserShiftDay = {
	active: boolean;
	start?: string;
	end?: string;
};
