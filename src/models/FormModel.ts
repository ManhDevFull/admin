export interface FormModel{
    title: string,
    layout: string,
    labelCol: number,
    wrapperCol: number,
    formItems: FormItem[]
}
export interface FormItem{
    key: string, 
    value: string,
    label: string,
    placeholder: string,
    type: string,
    required: boolean,
    message: string,
}