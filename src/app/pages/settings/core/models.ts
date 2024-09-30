export type SaveSettingsQueryResponse = {
	status: string;
	message: string;
};

export type GetSettingsQueryResponse = {
	status: string;
	data: Settings;
};

export type Settings = {
	id: number;
	patientTypes: string[];
	patientApplicationType: string[];
};
