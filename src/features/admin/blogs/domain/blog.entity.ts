export type BlogDbType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

export class Blog {
    constructor(name: string, description: string, websiteUrl: string, isMembership: boolean) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = new Date();
        this.isMembership = isMembership;
    }

    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
}
