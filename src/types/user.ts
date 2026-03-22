export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  phoneNumber: string;
  roles: string[];
  dateOfBirthday: string;
  idNumber: string;
  city: string;
}

const initialUserState: User = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  phoneNumber: "",
  roles: [],
  dateOfBirthday: "",
  idNumber: "",
  city: "",
};

export default initialUserState;
