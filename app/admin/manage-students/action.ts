"use server"

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";
import { AddStudentSchema, AddStudentSchemaType } from "@/lib/zodSchema";

export async function AddStudentAction(
  values: AddStudentSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    // Validate input
    const validation = AddStudentSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const data = validation.data;

    // 1. CHECK IF MATRIC NUMBER EXISTS
    const existingStudent = await prisma.approvedStudent.findUnique({
      where: {
        matricNumber: data.matricNumber.toUpperCase().trim(),
      },
    });

    if (existingStudent) {
      return {
        status: "error",
        message: "Matric number already exists",
      };
    }

    // 2. CREATE STUDENT
    await prisma.approvedStudent.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        otherName: data.otherName || null,
        faculty: data.faculty,
        department: data.department,
        matricNumber: data.matricNumber.toUpperCase().trim(),
      },
    });

    return {
      status: "success",
      message: "Student added successfully",
    };
  } catch (error) {
    console.log("Error creating student:", error);

    return {
      status: "error",
      message: "Failed to add student",
    };
  }
}