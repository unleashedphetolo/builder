export const TEMPLATE_REGISTRY = {};

const themes = ["modernBlue", "classicGreen", "darkMode"];
const layouts = ["SchoolLayout", "BusinessLayout"];

let count = 1;

layouts.forEach((layout) => {
  themes.forEach((theme) => {
    for (let i = 0; i < 20; i++) {
      TEMPLATE_REGISTRY[`template-${count}`] = {
        name: `${layout} ${count}`,
        layout,
        theme
      };
      count++;
    }
  });
});


// To get 1000:
// for (let i = 0; i < 200; i++)