import { z } from "zod";
//📌 Auth Schemas
export const userCredentialsSchema = z.object({
  email: z
    .email()
    .trim()
    .nonempty(" البريد الالكتروني مطلوب")
    .min(1, "يجب أن يتكون اسم المستخدم من حرف واحد على الأقل"),
  password: z
    .string()
    .trim()
    .nonempty("كلمة المرور مطلوبة")
    .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
});
//📌 User Schemas
const baseUserSchema = z.object({
  name: z
    .string({ message: "الاسم مطلوب" })
    .min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" })
    .max(100, { message: "الاسم يجب أن يكون أقل من 100 حرف" }),
  email: z.email({ message: "البريد الالكتروني  مطلوب" }),
  roles: z
    .array(z.number().min(1, { message: "الدور لا يمكن أن يكون فارغًا" }))
    .min(1, { message: "يجب أن يحتوي المستخدم على دور واحد على الأقل" }),
});

export const addUserSchema = baseUserSchema
  .extend({
    image: z
      .instanceof(File, { message: "يجب أن ترفع ملف صورة صالح" })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "يجب ألا يتجاوز حجم الصورة 2 ميغابايت",
      })
      .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        {
          message: "يجب أن تكون الصورة بصيغة JPEG أو PNG فقط",
        }
      ),
    password: z
      .string({ message: "حقل كلمة المرور مطلوب" })
      .min(8, { message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" })
      .max(100, { message: "كلمة المرور لا يجب أن تتجاوز 100 حرف" }),
    password_confirmation: z.string({ message: "حقل تاكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "تأكيد كلمة المرور غير متطابق",
    path: ["password_confirmation"],
  });
export const editUserSchema = baseUserSchema.extend({
  id: z.number(),
  image: z
    .union([
      z
        .instanceof(File, { message: "يجب أن ترفع ملف صورة صالح" })
        .refine((file) => file.size <= 2 * 1024 * 1024, {
          message: "يجب ألا يتجاوز حجم الصورة 2 ميغابايت",
        })
        .refine(
          (file) =>
            ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
          { message: "يجب أن تكون الصورة بصيغة JPEG أو PNG فقط" }
        ),
      z.string(),
    ])
    .refine((val) => val !== null, {
      message: "يجب أن ترفع ملف صورة صالح",
    }),
});
//📌 Password Schema
export const userPasswordSchema = z
  .object({
    id: z.number(),
    password: z
      .string({ message: "حقل كلمة المرور مطلوب" })
      .min(8, { message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" })
      .max(100, { message: "كلمة المرور لا يجب أن تتجاوز 100 حرف" }),
    password_confirmation: z.string({ message: "حقل تاكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "تأكيد كلمة المرور غير متطابق",
    path: ["password_confirmation"],
  });

//📌 Tag Schemas
const baseTagSchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  type: z.string().min(1, "نوع التصنيف مطلوب"),
});
export const addTagSchema = baseTagSchema;
export const editTagSchema = baseTagSchema.extend({
  id: z.number(),
});

//📌 Video Schemas
const baseVideoSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  video_id: z.string().min(1, "معرف الفيديو مطلوب"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "التاريخ غير صالح",
  }),
  tag_id: z.string({ message: "التصنيف غير صالح" }),
});
export const addVideoSchema = baseVideoSchema;
export const editVideoSchema = baseVideoSchema.extend({
  id: z.number(),
});

// 📌 Post schema
const basePostSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  text: z.string().nullable().optional(),
  image_url: z
    .string()
    .nullable() 
    .refine((val) => val !== null && val !== "", {
      message: "رابط الصورة مطلوب",
    })
    .refine((val) => !val || /^https?:\/\/.+$/.test(val), {
      message: "رابط الصورة غير صالح",
    }),
  image_name: z.string().nullable().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "التاريخ غير صالح",
  }),
  tag_id: z.string().trim().nonempty("التصنيف غير صالح"),
});
export const addPostSchema = basePostSchema;
export const editPostSchema = basePostSchema.extend({
  id: z.number(),
});

// 📌 Article schema
const baseArticleSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  text: z.string().min(1, "النص مطلوب"),
  image_url: z.string().url("رابط الصورة غير صالح"),
  image_name: z.string().nullable().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "التاريخ غير صالح",
  }),
  tag_id: z.string({ message: "التصنيف غير صالح" }),
});
export const addArticleSchema = baseArticleSchema;
export const editArticleSchema = basePostSchema.extend({
  id: z.number(),
});
