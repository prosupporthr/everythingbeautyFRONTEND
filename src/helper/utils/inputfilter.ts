
export const allowOnlyAlphaNumeric = (value: string) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, "")
}


export const allowOnlyAlphaNumericNoSpace = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, "");
};
  