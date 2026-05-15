type FormDataPrimitive =
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | File
    | Blob;

type FormDataValue =
    | FormDataPrimitive
    | FormDataValue[]
    | {
          [key: string]: FormDataValue;
      };

export const createFormData = <T extends object>(
    data: T,
): FormData => {
    const formData = new FormData();

    const appendValue = (
        key: string,
        value: FormDataValue,
    ) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return;
        }

        // File / Blob
        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
            return;
        }

        // Date
        if (value instanceof Date) {
            formData.append(key, value.toISOString());
            return;
        }

        // Array
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                appendValue(`${key}[${index}]`, item);
            });

            return;
        }

        // Object
        if (typeof value === "object") {
            Object.entries(
                value as Record<string, FormDataValue>,
            ).forEach(([nestedKey, nestedValue]) => {
                appendValue(
                    `${key}[${nestedKey}]`,
                    nestedValue,
                );
            });

            return;
        }

        // Primitive
        formData.append(key, String(value));
    };

    Object.entries(
        data as Record<string, FormDataValue>,
    ).forEach(([key, value]) => {
        appendValue(key, value);
    });

    return formData;
};