import { userModel } from '../../src/models/user';

const users = [
  {
    id: 1,
    email: 'emiliano@test.com',
    accountNumber: '10001',
  },
  {
    id: 2,
    email: 'jose@test.com',
    accountNumber: '10002',
  },
  {
    id: 3,
    email: 'francisco@test.com',
    accountNumber: '10003',
  },
  {
    id: 4,
    email: 'juan@test.com',
    accountNumber: '10004',
  },
];

export const getUserByIdMock = (userId: number): userModel => {
  return users.find((user) => user.id === userId) as userModel;
};
