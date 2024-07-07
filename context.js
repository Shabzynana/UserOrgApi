// const { mockDeep } = require('jest-mock-extended')

// const createMockContext = () => {
//   return {
//     prisma: mockDeep()
//   }
// }

// module.exports = {
//   createMockContext
// }

const prisma = require('./prisma/client');

async function createUser (user) {
  if (user.acceptTermsAndConditions) {
    return await prisma.user.create({
      data: user
    })
  } else {
    return new Error('User must accept terms!')
  }
}


module.exports = {
  createUser,
  
}