export const Common = {
  Email: {
    MAX_LENGTH: 256,
  },
  Phone: {
    MAX_LENGTH: 16,
  },
  FullName: {
    MAX_LENGTH: 128,
  },
};

export const Regex = {
  PASSWORD: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,32})/,
};
