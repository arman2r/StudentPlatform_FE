export interface PartnerStudent {
    [subject: string]: string[];
}

export interface ResponsePartner {
    subject?: string;
    partners?: string[];
}