export interface ICategory {
    name: string;
    _id: string;
    slug?: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
    children?: ICategory[];
  }
  export interface SelectCate{
    label: string,
    value: string
  }