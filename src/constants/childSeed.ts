import { addDays, format, subMonths, subYears } from "date-fns";
import type { Child, ChildClass, ChildMark, Gender, Service } from "@/utils/types";
import { classForAge } from "@/utils/children";

export const starterClasses: ChildClass[] = [
  { id: "seedlings", name: "Seedlings", emoji: "🌱", minAge: 0, maxAge: 6 },
  { id: "buds", name: "Buds", emoji: "🌷", minAge: 7, maxAge: 12 },
  { id: "blooms", name: "Blooms", emoji: "🌸", minAge: 13, maxAge: 16 },
];

type Row = [string, string, Gender, number, boolean, string?, string?];

const rows: Row[] = [
  ["Chidera", "Okafor", "female", 8, true, "+2348031110001", "Ngozi Okafor"],
  ["Tobi", "Adeyemi", "male", 14, true, "+2348031110002", "Kemi Adeyemi"],
  ["Ifeoma", "Nwosu", "female", 5, false, "+2348031110003", "Chika Nwosu"],
  ["Daniel", "Bassey", "male", 15, true, "+2348031110004", "Ini Bassey"],
  ["Zainab", "Bello", "female", 9, true, "+2348031110005", "Hauwa Bello"],
  ["Emmanuel", "Etim", "male", 4, false, "+2348031110006", "Arit Etim"],
  ["Precious", "Udo", "female", 13, true],
  ["Samuel", "Ogunleye", "male", 8, true, "+2348031110008", "Bola Ogunleye"],
  ["Blessing", "Eze", "female", 10, false, "+2348031110009", "Uche Eze"],
  ["David", "Akpan", "male", 3, true, "+2348031110010", "Mfon Akpan"],
  ["Favour", "Obi", "female", 16, true],
  ["Joshua", "Ibe", "male", 11, false, "+2348031110012", "Ada Ibe"],
  ["Esther", "Lawal", "female", 6, true, "+2348031110013", "Sade Lawal"],
  ["Michael", "Effiong", "male", 13, true, "+2348031110014", "Eno Effiong"],
  ["Grace", "Okon", "female", 7, false, "+2348031110015", "Idara Okon"],
  ["Victor", "Adebayo", "male", 10, true, "+2348031110016", "Tola Adebayo"],
  ["Mercy", "Uche", "female", 5, true],
  ["Caleb", "Nnamdi", "male", 14, false, "+2348031110018", "Obi Nnamdi"],
  ["Deborah", "Ekong", "female", 9, true, "+2348031110019", "Nse Ekong"],
  ["Peter", "Afolabi", "male", 6, true, "+2348031110020", "Yemi Afolabi"],
  ["Ruth", "Okeke", "female", 12, false, "+2348031110021", "Ify Okeke"],
  ["Elijah", "Musa", "male", 8, true, "+2348031110022", "Amina Musa"],
  ["Hannah", "Ojo", "female", 15, true],
  ["Isaac", "Inyang", "male", 4, false, "+2348031110024", "Ekaette Inyang"],
  ["Miriam", "Danjuma", "female", 12, true, "+2348031110025", "Laraba Danjuma"],
];

export const buildChildren = (today = new Date()): Child[] =>
  rows.map(([firstName, surname, gender, age, hasDob, parentPhone, parentName], index) => ({
    id: `c${index + 1}`,
    serial: index + 1,
    firstName,
    surname,
    gender,
    age,
    dob: hasDob
      ? format(addDays(subYears(today, age), -(index * 23 + 15)), "yyyy-MM-dd")
      : undefined,
    parentPhone,
    parentName,
    classId: classForAge(starterClasses, age)?.id ?? "",
    archived: false,
    createdAt: subMonths(today, 6).toISOString(),
  }));

const absentTail: Record<number, number> = { 4: 3, 11: 4, 19: 5 };

const seededRandom = () => {
  let value = 42;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
};

export const buildChildMarks = (children: Child[], services: Service[]): ChildMark[] => {
  const today = format(new Date(), "yyyy-MM-dd");
  const past = services.filter((service) => service.date < today);
  const random = seededRandom();
  return children.flatMap((child, childIndex) => {
    const rate = childIndex === 0 ? 1 : 0.55 + random() * 0.4;
    const tail = absentTail[childIndex] ?? 0;
    return past.map((service, serviceIndex) => ({
      childId: child.id,
      serviceId: service.id,
      status:
        serviceIndex < past.length - tail && random() < rate
          ? ("present" as const)
          : ("absent" as const),
    }));
  });
};
