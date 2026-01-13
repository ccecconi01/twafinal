const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();
const { verifyAdmin } = require('./middlewares/auth');

app.use(cors());
app.use(express.json());

// --- AUTENTICAÇÃO SIMPLES ---
app.post('/api/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        // Busca o utilizador no banco pelo username
        const foundUser = await prisma.user.findUnique({
            where: { username: user }
        });

        // Verifica se usuário existe E se a senha bate
        // OBS: Em produção real, usaríamos bcrypt para não salvar senha pura
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

// --- PARCERIAS (PARTNERSHIPS) ---

// Listar com Filtros
app.get('/api/partnerships', async (req, res) => {
    const { country, area, blended, hasStudy, hasInternship, hasTeaching, hasTraining } = req.query;
    
    let where = {};
    
    // Filtros parciais (contains) para texto
    if (country) where.country = { contains: country };
    if (area) where.areas = { contains: area };
    if (blended === 'true') where.blendedIntensive = true;

    // Filtro "inteligente": Se marcou "Estudos", o campo studentsStudyCount não pode ser N/A ou vazio
    // Nota: como é string, assumimos que se tiver conteudo é válido, ou verificamos se não é "N/A"
    if (hasStudy === 'true') where.studentsStudyCount = { not: { contains: "N/A" } };
    if (hasInternship === 'true') where.studentsInternshipCount = { not: { contains: "N/A" } };
    if (hasTeaching === 'true') where.staffTeachingCount = { not: { contains: "N/A" } };
    if (hasTraining === 'true') where.staffTrainingCount = { not: { contains: "N/A" } };

    const partnerships = await prisma.partnership.findMany({ where });
    res.json(partnerships);
});

// Criar (Só GRIM no frontend libera o botão, mas validamos aqui tbm se quisesse)
app.post('/api/partnerships', verifyAdmin, async (req, res) => {
    try {
        const newItem = await prisma.partnership.create({ data: req.body });
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: "Erro ao criar parceria" });
    }
});


// --- ROTA DE APAGAR PARCERIA ---
app.delete('/api/partnerships/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // Antes de apagar a parceria, temos de decidir o que fazer com as mobilidades ligadas a ela.
        // O Prisma pode dar erro se existirem mobilidades dependentes desta parceria.
        // Opção 1: Apagar as mobilidades também (Cascade Delete - configurado no schema.prisma)
        // Opção 2 (Mais segura): Desconectar as mobilidades (colocar partnershipId = null) ou impedir.
        
        // Vamos tentar apagar direto (assumindo que o schema permite ou não tem dependencias)
        await prisma.partnership.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Parceria removida!" });
    } catch (error) {
        res.status(500).json({ error: "Não foi possível apagar esta parceria (pode ter mobilidades associadas)." });
    }
});

// --- MOBILIDADES ---

//READ Mobilidades com Filtros
app.get('/api/mobilities', async (req, res) => {
    const { country, role, school, direction } = req.query;
    let where = {};

    if (country) where.country = { contains: country };
    if (role) where.role = role; // Exato
    if (school) where.school = school; // Exato
    if (direction) where.direction = direction; // IN ou OUT

    const items = await prisma.mobility.findMany({ where });
    res.json(items);
});

// CREATE Mobilidade
app.post('/api/mobilities', verifyAdmin, async (req, res) => {
    try {
        // Conversão simples de data string para objeto Date
        const data = { ...req.body };
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        
        const newItem = await prisma.mobility.create({ data });
        res.json(newItem);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao criar mobilidade" });
    }
});

// DELETE de Mobilidade
app.delete('/api/mobilities/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.mobility.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Mobilidade apagada com sucesso!" });
    } catch (error) {
        // Erro comum: O registo não existe
        res.status(500).json({ error: "Erro ao apagar: Registo não encontrado ou erro de servidor." });
    }
});

// --- DASHBOARD DINÂMICO ---
app.get('/api/stats', async (req, res) => {
    // 1. Totais IN vs OUT
    const dirGroups = await prisma.mobility.groupBy({
        by: ['direction'],
        _count: { direction: true }
    });
    
    // 2. Por Escola
    const schoolGroups = await prisma.mobility.groupBy({
        by: ['school'],
        _count: { school: true }
    });

    // 3. Por Status
    const statusGroups = await prisma.mobility.groupBy({
        by: ['status'],
        _count: { status: true }
    });

    // 4. Alunos vs Staff
    const roleGroups = await prisma.mobility.groupBy({
        by: ['role'],
        _count: { role: true }
    });

    // Formatar para ficar fácil no frontend
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
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API a rodar na porta ${PORT}`));