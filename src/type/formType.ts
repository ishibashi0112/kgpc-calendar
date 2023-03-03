import {
  editFormSchema,
  formSchema,
  transformedEditFormSchema,
  transformedProcessSchema,
  transformedSchema,
} from "src/pages-component/form/schema/zodSchema";
import { z } from "zod";

export type FormValues = z.infer<typeof formSchema>;
export type EditFormValues = z.infer<typeof editFormSchema>;

// export type EditFormValues = Omit<FormValues, "file"> & {
//   prevFile: string;
//   updatedFile: File | null;
// };

export type TransformedProcessValues = z.infer<typeof transformedProcessSchema>;
export type TransformedFormValues = z.infer<typeof transformedSchema>;
export type TransformedEditFormValues = z.infer<
  typeof transformedEditFormSchema
>;
