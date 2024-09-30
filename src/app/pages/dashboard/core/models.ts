export type TurkeyMapQueryResponse = {
	status: string;
	message: string;
	projects: MapProjectData[];
};

export type MapProjectData = {
	city: string;
	project_names: string[];
};

export type ChartData = {
	status: string;
	dates: string[];
	entryFormCount: number[];
	exitFormCount: number[];
	inventoryFormCount: number[];
	patientFormCount: number[];
};
