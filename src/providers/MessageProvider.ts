import {createRef, RefObject} from "react";
import {Toast} from "primereact/toast";

export const toastRef: RefObject<Toast | null> = createRef<Toast | null>();

export const showMessage = (options: {
    severity?: "info" | "success" | "error" | "contrast" | "warn" | "secondary" | undefined,
    message?: string,
    summary: string
}): void => {
    toastRef.current && toastRef.current.show({
        severity: options.severity,
        detail: options.message,
        summary: options.summary
    })
}


