export type SaveTemplateQueryResponse = {
	status: string;
	message: string;
	code: string;
};

export type EmailTemplateQueryResponse = {
	status: string;
	message: string;
	data: EmailTemplate;
};

export type EmailTemplate = {
	id: number;
	subject: string;
	body: string;
	bodyCss: string;
	createdBy: number;
	createdByName: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};
