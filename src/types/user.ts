export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  chatToken: string;
  phoneNumber: string;
  roles: string[];
  dateOfBirthday: string;
  idNumber: string;
  city: string;
}

const initialUserState: User = {
  _id: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  phoneNumber: "",
  roles: [],
  dateOfBirthday: "",
  idNumber: "",
  city: "",
  chatToken: "",
};

export default initialUserState;
