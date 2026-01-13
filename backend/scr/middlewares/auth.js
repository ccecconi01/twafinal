// backend/src/middlewares/auth.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função que verifica se o usuário é ADMIN
async function verifyAdmin(req, res, next) {
    // Como ainda não estamos usando Tokens complexos (JWT), 
    // vamos pegar o usuário que vem no Header da requisição 'x-user-id'
    // (Vamos configurar o frontend para mandar isso)
    
    const username = req.headers['x-user-username']; 

    if (!username) {
        return res.status(401).json({ error: "Você precisa estar logado." });
    }

    const user = await prisma.user.findUnique({
        where: { username: username }
    });

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Acesso Negado: Apenas administradores (grim) podem fazer isso." });
    }

    // Se chegou aqui, é admin. Pode passar!
    next();
}

module.exports = { verifyAdmin };