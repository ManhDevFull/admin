export const replaceName = (str: string) => {
  return str
    .normalize("NFD")
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "Đ")
    .replace(/ /g, "-")
    .replace(/[:!@#$%^&*()?;/]/g, "");
};
