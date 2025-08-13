// This file defines the database schema using Drizzle ORM for a medical appointment system.
import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: text().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelationsTable = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicTable),
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});



export const usersToClinicTable = pgTable("users_to_clinic", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  cratetAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const usersToClinicsTAbleRelations = relations(
  usersToClinicTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  userToClinics: many(usersToClinicTable),
}));

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  specyality: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  //1 - Monday, 2 - Tuesday, ..., 0 - Sunday
  availableFromWeekDAy: text("available_from_week_day").notNull(),
  avaialabreToWeekDay: text("available_to_week_day").notNull(),
  avaialabreFromTime: text("available_from_time").notNull(),
  avaialabreToTime: text("available_to_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const doctorsRelationsTable = relations(doctorsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

export const patientSexEnum = pgEnum("patient_sex_enum", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  sex: patientSexEnum("sex").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  creatAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [patientsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id, {
      onDelete: "cascade",
    }),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id, {
      onDelete: "cascade",
    }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const appointmentsRelationsTable = relations(
  appointmentsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
  }),
);
