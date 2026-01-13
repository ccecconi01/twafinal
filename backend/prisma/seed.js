// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dados Mockados para teste inicial (Substituir pela leitura real do CSV se quiser fazer parsing)
// Estou colocando Strings nos numeros como pedido ("2+2")
const partnershipsData = [
  {
    country: "ALEMANHA - DE",
    institution: "HNU - Neu Ulm",
    website: "https://www.hnu.de/en/",
    erasmusCode: "D ULM03",
    areas: "GE",
    studentsStudyCount: "4",
    studentsStudyMonths: "5",
    staffTeachingCount: "2",
    staffTeachingDur: "5 dias",
    blendedIntensive: false
  },
  {
    country: "BÉLGICA - BE",
    institution: "Karel de Grote University College",
    website: "https://www.kdg.be/en",
    erasmusCode: "B ANTWERP59",
    areas: "RH - GE",
    studentsStudyCount: "2+2", // Exemplo do requisito de string
    studentsStudyMonths: "5",
    blendedIntensive: true
  }
];

const mobilitiesData = [
  {
    direction: "OUT",
    role: "STUDENT",
    type: "Estudos: Longa Duração",
    status: "ONGOING",
    school: "GESTAO",
    country: "ALEMANHA",
    candidateEmail: "nominated.student@gmail.com",
    candidateFirstName: "Desiderius",
    candidateLastName: "Erasmusis",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-01-30"),
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

const usersData = [
  { username: 'sigq', password: 's1i2g3q4', role: 'viewer' },
  { username: 'grim', password: 'g1r2i3m4', role: 'admin' }, // grim é o Admin
  { username: 'pres', password: 'p1r2e3s4', role: 'viewer' }
];

  
async function main() {
  console.log('Limpando banco...');
  await prisma.mobility.deleteMany();
  await prisma.partnership.deleteMany();
  await prisma.user.deleteMany();

  console.log('Inserindo Parcerias...');
  for (const p of partnershipsData) {
    await prisma.partnership.create({ data: p });
  }

  console.log('Inserindo Mobilidades...');
  for (const m of mobilitiesData) {
    await prisma.mobility.create({ data: m });
  }

  console.log('Criando Users...');
  for (const u of usersData) {
    await prisma.user.create({ data: u });
  }
  
  console.log('Seed concluído!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());