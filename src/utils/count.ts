export const countOf = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

export const peopleCount = (count: number) => (count === 1 ? "1 person" : `${count} people`);
