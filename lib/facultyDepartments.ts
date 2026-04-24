export const facultyDepartments = {
  "School of Computing": [
    "Software Engineering",
    "Computer Science",
    "Data Science",
    "Information Technology",
  ],
  "School of Engineering": [
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
  ],
  "School of Life Sciences": ["Biology", "Marine Science", "Microbiology"],
  "School of Agriculture": ["Agronomy", "Animal Science"],
  "School of Health": ["Nursing", "Public Health"],
  "School of Environmental Technology": ["Architecture", "Estate Management"],
  "School of Physical Sciences": ["Physics", "Chemistry", "Mathematics"],
} as const satisfies Record<string, readonly string[]>;

export type Faculty = keyof typeof facultyDepartments;

export type Department = (typeof facultyDepartments)[Faculty][number];
