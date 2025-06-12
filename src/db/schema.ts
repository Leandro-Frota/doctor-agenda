// This file defines the database schema using Drizzle ORM for a medical appointment system.
import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
});

export const userRelationsTable = relations(usersTable, ({ many }) => ({
  userToClinics : many(userToClinicTable),
}));

export const clinicsTable = pgTable("clinics", {
    id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const clinicRelationsTable = relations(clinicsTable, ({ many }) => ({
    doctors: many(doctorsTable),
    patients: many(patientsTable),
    appointments: many(appointmentTable),
    userToClinics: many(userToClinicTable),
    }));


export const userToClinicTable = pgTable("user_to_clinic", {
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
    cratetAt: timestamp("created_at").defaultNow(),
    updateAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const usersToClinicsTAbleRelations = relations(userToClinicTable, 
        ({ one }) => ({
            user: one(usersTable, {
                fields: [userToClinicTable.userId],
                references: [usersTable.id],
            }),
            clinic: one(clinicsTable, {
                fields: [userToClinicTable.clinicId],
                references: [clinicsTable.id],
            }),
        }));

export const doctorsTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, {
      onDelete: "cascade"}),
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
    updateAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const doctorRelationsTable = relations(doctorsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
}));

export const patientSexEnum = pgEnum("patient_sex_enum", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, {
    onDelete: "cascade"}),
  name: text("name").notNull(),
  email: text("email").notNull(),
  sex: patientSexEnum("sex").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  creatAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),


});

export const patientRelationsTable = relations(patientsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [patientsTable.clinicId],
        references: [clinicsTable.id],
        }),

    }));


export const appointmentTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    patientId: uuid("patient_id").notNull().references(() => patientsTable.id, {
      onDelete: "cascade"}),
    doctorId: uuid("doctor_id").notNull().references(() => doctorsTable.id, {
      onDelete: "cascade"}),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, {
      onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow(),
    updateAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export const appointmentRelationsTable = relations(appointmentTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [appointmentTable.clinicId],
        references: [clinicsTable.id],
        }),
    patient: one(patientsTable, {
        fields: [appointmentTable.patientId],
        references: [patientsTable.id],
        }),
    doctor: one(doctorsTable, {
        fields: [appointmentTable.doctorId],
        references: [doctorsTable.id],
        }),
    }));