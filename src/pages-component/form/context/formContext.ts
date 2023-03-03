import { createFormContext } from "@mantine/form";
import { EditFormValues, FormValues } from "src/type/formType";

export const [FormProvider, useFormContext, useForm] =
  createFormContext<FormValues>();

export const [EditFormProvider, useEditFormContext, useEditForm] =
  createFormContext<EditFormValues>();
