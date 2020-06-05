export const Blue = {
  medium: "#b2d1ff",
  dark: "#0052cc",
};

export const Green = {
  medium: "#a0ffdf",
  dark: "#00875a",
};

export const Grey = {
  light: "#F4F5F7",
  medium: "#dfe1e6",
  dark: "#b4b4b4",
};

export const Red = {
  light: "#e57373",
  medium: "#f44336",
  dark: "#d32f2f",
};

const StatusCategoryColours = {
  new: Grey.medium,
  done: Green.medium,
  default: Blue.medium,
};

export function getStatusColour({ status, category, settings }) {
  const colour =
    settings.statusColours[status] ||
    StatusCategoryColours[category] ||
    StatusCategoryColours.default;
  return colour;
}

export function setStatusColour({ status, colour, settings }) {
  settings.statusColours[status] = colour;
}
