export function generateSchoolSite() {
  return [
    {
      id: crypto.randomUUID(),
      type: "hero",
      content: { title: "School 1" }
    },
    {
      id: crypto.randomUUID(),
      type: "services",
      content: { items: ["Math", "Science"] }
    }
  ];
}
