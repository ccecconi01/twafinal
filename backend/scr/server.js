const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();
const { verifyAdmin } = require('./middlewares/auth');

app.use(cors());
app.use(express.json());

// --- AUTENTICAÇÃO ---
app.post('/api/login', async (req, res) => {
    const { user, password } = req.body;
    try {
           // Verifica se usuário existe E se a senha bate
        const foundUser = await prisma.user.findUnique({ where: { username: user } });
        if (foundUser && foundUser.password === password) {
            return res.json({ 
                success: true, 
                user: foundUser.username, 
                role: foundUser.role 
            });
        }
        res.status(401).json({ success: false, message: "Credenciais inválidas" });
    } catch (e) {
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// --- PARCERIAS ---
app.get('/api/partnerships', async (req, res) => {
    const { country, area, blended, study, internship, teaching, training } = req.query;
    
    let where = {};
    // Filtros parciais (contains) para texto
    if (country) where.country = { contains: country };
    if (area) where.areas = { contains: area };
    if (blended === 'true') where.blendedIntensive = true;

    // Filtros de Vagas Ativas (Checkboxes do Frontend)
    // Se o user marcar "Estudos", mostra apenas quem NÃO tem "N/A", vazio ou "0"
    if (study === 'true') where.studentsStudyCount = { notIn: ["N/A", "", "0"] };
    if (internship === 'true') where.studentsInternshipCount = { notIn: ["N/A", "", "0"] };
    if (teaching === 'true') where.staffTeachingCount = { notIn: ["N/A", "", "0"] };
    if (training === 'true') where.staffTrainingCount = { notIn: ["N/A", "", "0"] };

    try {
        const list = await prisma.partnership.findMany({ where, orderBy: { institution: 'asc' } });
        res.json(list);
    } catch (e) {
        res.status(500).json({ error: "Erro ao listar parcerias" });
    }
});

app.post('/api/partnerships', verifyAdmin, async (req, res) => {
    try {
        const newItem = await prisma.partnership.create({ data: req.body });
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: "Erro ao criar parceria" });
    }
});
// Rota Deletar parceria (só admin)
app.delete('/api/partnerships/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.partnership.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Parceria removida!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao apagar: verifique se existem mobilidades ligadas a esta parceria." });
    }
});

// --- MOBILIDADES ---


//READ Mobilidades com Filtros
app.get('/api/mobilities', async (req, res) => {
    const { country, school, studyLong, studyShort, internship, teaching, training, direction, status } = req.query;
    let where = {};

    if (country) where.country = { contains: country };
    if (school && school !== 'ALL') where.school = school; 
    if (direction && direction !== 'ALL') where.direction = direction; 
    if (status && status !== 'ALL') where.status = status; 

    // Filtro por tipo de mobilidade
    const selectedTypes = [];
    if (studyLong === 'true') selectedTypes.push('Estudos (longa-duração)');
    if (studyShort === 'true') selectedTypes.push('Estudos (curta-duração)');
    if (internship === 'true') selectedTypes.push('Estágios');
    if (teaching === 'true') selectedTypes.push('Ensino');
    if (training === 'true') selectedTypes.push('Formação');

    if (selectedTypes.length > 0) {
        where.type = { in: selectedTypes };
    }

    try {
        const items = await prisma.mobility.findMany({ where, orderBy: { startDate: 'desc' } });
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: "Erro ao listar mobilidades" });
    }
});
// CREATE Mobilidade
app.post('/api/mobilities', verifyAdmin, async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        
        const newItem = await prisma.mobility.create({ data });
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: "Erro ao criar mobilidade" });
    }
});

// DELETE de Mobilidade
app.delete('/api/mobilities/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.mobility.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Removida!" });
    } catch (e) {
        res.status(500).json({ error: "Erro ao apagar" });
    }
});

// --- DASHBOARD (ESTATÍSTICAS) ---
app.get('/api/stats', async (req, res) => {
    try {
        const dirGroups = await prisma.mobility.groupBy({ by: ['direction'], _count: { direction: true } });
        const schoolGroups = await prisma.mobility.groupBy({ by: ['school'], _count: { school: true } });
        const statusGroups = await prisma.mobility.groupBy({ by: ['status'], _count: { status: true } });
        const roleGroups = await prisma.mobility.groupBy({ by: ['role'], _count: { role: true } });

        const stats = {
            in: dirGroups.find(g => g.direction === 'IN')?._count.direction || 0,
            out: dirGroups.find(g => g.direction === 'OUT')?._count.direction || 0,
            schoolGestao: schoolGroups.find(g => g.school === 'GESTAO')?._count.school || 0,
            schoolTec: schoolGroups.find(g => g.school === 'TECNOLOGIA')?._count.school || 0,
            completed: statusGroups.find(g => g.status === 'COMPLETED')?._count.status || 0,
            ongoing: statusGroups.find(g => g.status === 'ONGOING')?._count.status || 0,
            planned: statusGroups.find(g => g.status === 'PLANNED')?._count.status || 0,
            students: roleGroups.find(g => g.role === 'STUDENT')?._count.role || 0,
            staff: roleGroups.find(g => g.role === 'STAFF')?._count.role || 0,
        };
        res.json(stats);
    } catch (e) {
        res.status(500).json({ error: "Erro ao gerar estatísticas" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 ISLA API rodando na porta ${PORT}`));