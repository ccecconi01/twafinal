const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

async function main() {
  console.log("A iniciar importação...");
  const filePath = path.join(__dirname, 'Parcerias Erasmus+ (ATUALIZADA).csv');

  if (!fs.existsSync(filePath)) {
    console.error("Ficheiro não encontrado!");
    return;
  }

  // Limpa as parcerias para evitar duplicados (Ponto de atenção 3 corrigido)
  console.log("A limpar base de dados...");
  await prisma.partnership.deleteMany({}); 

  const results = [];
  let rowCount = 0;

  fs.createReadStream(filePath)
    .pipe(csv({ 
        separator: ',', 
        headers: false // Lemos por índice (0, 1, 2...) porque os nomes das colunas têm espaços e vírgulas
    })) 
    .on('data', (row) => {
      rowCount++;

      // DEBUG: Imprime a primeira linha de dados para confirmarmos os índices
      if (rowCount === 2) { 
        console.log("Exemplo da primeira linha lida:", Object.values(row));
      }

      // Saltamos a primeira linha (Cabeçalho principal)
      if (rowCount === 1) return;

      const item = {
        country: row[0]?.trim() || '',
        institution: row[1]?.trim() || '',
        website: row[2]?.trim() || null,
        erasmusCode: row[3]?.trim() || null,
        areas: row[4]?.trim() || null,
        
        // Mapeamento baseado na tua folha:
        studentsStudyCount: row[5]?.trim() || '0',
        studentsStudyMonths: row[6]?.trim() || '0',
        studentsInternshipCount: row[8]?.trim() || '0',
        studentsInternshipMonths: row[9]?.trim() || '0',
        
        staffTeachingCount: row[11]?.trim() || '0',
        staffTeachingDur: row[12]?.trim() || '0',
        staffTrainingCount: row[13]?.trim() || '0',
        staffTrainingDur: row[14]?.trim() || '0',

        // Ignoramos row[15] (Válido) e row[16] (Em renovação)
        blendedIntensive: false // Definimos como falso por padrão (podes editar no site depois)
      };

      // Validamos se a linha tem mesmo uma instituição
      if (item.institution && item.institution !== "Instituição") {
        results.push(item);
      }
    })
    .on('end', async () => {
      if (results.length === 0) {
        console.error("ERRO: Processados 0 registos. Verifica se o ficheiro usa mesmo VÍRGULAS ou se é PONTO E VÍRGULA (;).");
        await prisma.$disconnect();
        return;
      }

      console.log(`A inserir ${results.length} parcerias...`);
      for (const p of results) {
        await prisma.partnership.create({ data: p });
      }

      console.log("Concluído!");
      await prisma.$disconnect();
    });
}

main();