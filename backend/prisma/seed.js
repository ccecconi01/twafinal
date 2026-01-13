const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const usersData = [
  { username: 'sigq', password: 's1i2g3q4', role: 'viewer' },
  { username: 'grim', password: 'g1r2i3m4', role: 'admin' }, 
  { username: 'pres', password: 'p1r2e3s4', role: 'viewer' }
];

const mobilitiesData = [
  {
    direction: "OUT",
    role: "STUDENT",
    type: "Estudos: Longa Duração",
    status: "ONGOING",
    school: "GESTAO",
    country: "ALEMANHA",
    candidateEmail: "aluno.exemplo@gmail.com",
    candidateFirstName: "Tiago",
    candidateLastName: "Silva",
    startDate: new Date("2024-09-15"),
    endDate: new Date("2025-02-15"),
    receivingInstitution: "HNU - Neu Ulm",
    sendingInstitution: "ISLA Gaia"
  },
  {
    direction: "IN",
    role: "STAFF",
    type: "Ensino",
    status: "COMPLETED",
    school: "TECNOLOGIA",
    country: "ESPANHA",
    candidateEmail: "prof.garcia@uni.es",
    candidateFirstName: "Juan",
    candidateLastName: "Garcia",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-07"),
    receivingInstitution: "ISLA Gaia",
    sendingInstitution: "Universidad de Madrid"
  }
];

async function main() {
  console.log('Limpando Utilizadores e Mobilidades...');
  
  // NÃO limpamos as Partnerships aqui para não apagar o teu CSV
  await prisma.user.deleteMany();
  await prisma.mobility.deleteMany();

  console.log('Criando Utilizadores...');
  for (const u of usersData) {
    await prisma.user.create({ data: u });
  }

  console.log('Criando Mobilidades Fake...');
  for (const m of mobilitiesData) {
    await prisma.mobility.create({ data: m });
  }
  
  console.log('Seed concluído! (Parcerias mantidas)');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());