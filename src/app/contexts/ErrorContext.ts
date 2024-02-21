import { message } from "antd"
import { each, keys, map } from "lodash-es"

export namespace Errors {
    "use strict"

    const errorMessage = "message"
    
    export const FormError = (form: any, errors: any) => {
        each(keys(errors), (key: string) => {
            if (key != errorMessage) return

            const value = form.getFieldValue(key)
            if (value === undefined) {
                message.error(errors[key])
                return
            }

            form.setFields({
                [key]: {
                    value: value,
                    errors: map(errors[key], (message: string) => {
                        console.log("errors", message)
                        return new Error(message)
                    })
                },
            })

            message.error(errors[key])
        })
    }

    export const AjaxError = (errors: any) => {
        each(keys(errors), (key: string) => {
            if (key != errorMessage) return

            message.error(errors[key])
        })
    }

    export const SingleError = (error: string) => {
        message.error(error)
    }
}