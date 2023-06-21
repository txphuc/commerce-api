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
  Name: {
    MAX_LENGTH: 64,
  },
  Description: {
    MAX_LENGTH: 256,
  },
};

export const Regex = {
  PASSWORD: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,32})/,
  DATE: /^(((\d{4}-((0[13578]-|1[02]-)(0[1-9]|[12]\d|3[01])|(0[13456789]-|1[012]-)(0[1-9]|[12]\d|30)|02-(0[1-9]|1\d|2[0-8])))|((([02468][048]|[13579][26])00|\d{2}([13579][26]|0[48]|[2468][048])))-02-29)){0,10}$/,
};
