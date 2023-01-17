import { UseFormReturnType } from "@mantine/form";
import {
  formSchema,
  transformedEditFormSchema,
  transformedProcessSchema,
  transformedSchema,
} from "src/pages-component/form/schema/zodSchema";
import { z } from "zod";

export type FormValues<FileType extends File | string = File> = Omit<
  z.infer<typeof formSchema>,
  "file"
> & { file: FileType | null };

export type TransformedProcessValues = z.infer<typeof transformedProcessSchema>;
export type TransformedFormValues = z.infer<typeof transformedSchema>;
export type TransformedEditFormValues = z.infer<
  typeof transformedEditFormSchema
>;

export type Form = UseFormReturnType<
  FormValues,
  (values: FormValues) => FormValues
>;
