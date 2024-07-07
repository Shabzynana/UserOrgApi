const { mockDeep, mockReset } = require('jest-mock-extended')

const prismaa = require('./prisma/client');
const prisma = prismaa

jest.mock('./prisma/client', () => mockDeep())

beforeEach(() => {
  mockReset(prisma)
})

module.exports = { prisma }