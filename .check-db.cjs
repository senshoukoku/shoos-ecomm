const { PrismaClient } = require('./app/generated/prisma/client');
const p = new PrismaClient();
p.product.findMany({ select: { name: true, imageUrls: true } }).then(r => {
  r.forEach(x => console.log(x.name, JSON.stringify(x.imageUrls)));
  return p.$disconnect();
}).catch(e => { console.error(e); return p.$disconnect(); });